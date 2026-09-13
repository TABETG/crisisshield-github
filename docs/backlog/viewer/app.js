/* Backlog Viewer — app.js
   - Charge backlog.csv
   - Recherche / filtres / tri / stats / export CSV / copie JSON / thème
*/

'use strict';

/**********************************************************************
 * DOM utils
 **********************************************************************/
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function normalize(s){
  return (s ?? "").toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function acToList(ac){
  // "A | B | C" -> ["A","B","C"]
  return (ac ?? "")
    .split("|")
    .map(x => x.trim())
    .filter(Boolean);
}

function escapeHtml(s){
  return (s ?? "").toString().replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function toast(msg, pill=""){
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  const p = $("#toastPill");
  p.textContent = pill;
  p.style.display = pill ? "inline-flex" : "none";
  t.style.display = "inline-flex";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(()=> t.style.display="none", 2200);
}

/**********************************************************************
 * CSV parsing (supports quotes, commas, newlines)
 **********************************************************************/
function parseCsv(text){
  // RFC4180-ish parser (no deps)
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  const pushField = () => { row.push(field); field = ""; };
  const pushRow = () => { rows.push(row); row = []; };

  while(i < text.length){
    const c = text[i];

    if(inQuotes){
      if(c === '"'){
        const next = text[i+1];
        if(next === '"'){ // escaped quote
          field += '"';
          i += 2;
          continue;
        }else{
          inQuotes = false;
          i += 1;
          continue;
        }
      }else{
        field += c;
        i += 1;
        continue;
      }
    }else{
      if(c === '"'){
        inQuotes = true;
        i += 1;
        continue;
      }
      if(c === ','){
        pushField();
        i += 1;
        continue;
      }
      if(c === '\r'){
        i += 1;
        continue;
      }
      if(c === '\n'){
        pushField();
        pushRow();
        i += 1;
        continue;
      }
      field += c;
      i += 1;
    }
  }

  // flush last field/row
  pushField();
  pushRow();

  // trim possible trailing empty row
  if(rows.length && rows[rows.length-1].every(v => (v ?? "") === "")){
    rows.pop();
  }

  return rows;
}

function csvToObjects(csvText){
  const matrix = parseCsv(csvText);
  if(!matrix.length) return [];
  const headers = matrix[0].map(h => h.trim());
  const out = [];

  for(let r = 1; r < matrix.length; r++){
    const line = matrix[r];
    if(line.every(v => (v ?? "").trim() === "")) continue;
    const obj = {};
    for(let c = 0; c < headers.length; c++){
      obj[headers[c]] = (line[c] ?? "").trim();
    }
    // normalize keys expected by the UI
    obj.STORY_POINTS = Number(obj.STORY_POINTS || 0);
    out.push(obj);
  }
  return out;
}

function toCsv(rows){
  const headers = ["EPIC_ID","EPIC_NAME","US_ID","US_TITLE","USER_STORY","STORY_POINTS","AC"];
  const lines = [headers.join(",")];
  for(const r of rows){
    const row = headers.map(h => {
      const v = (r[h] ?? "").toString();
      const needsQuote = /[",\n]/.test(v);
      const safe = v.replace(/"/g, '""');
      return needsQuote ? `"${safe}"` : safe;
    }).join(",");
    lines.push(row);
  }
  return lines.join("\n");
}

function downloadText(filename, text, mime="text/plain"){
  const blob = new Blob([text], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/**********************************************************************
 * App state
 **********************************************************************/
const state = {
  q: "",
  epic: "",
  minSp: "",
  sortBy: "epic_then_id",
  viewMode: "grouped",
  collapsedEpics: new Set(),
  theme: localStorage.getItem("backlog_theme") || "dark",
};

let BACKLOG = []; // populated from CSV

function loadPrefs(){
  try{
    const raw = localStorage.getItem("backlog_prefs");
    if(!raw) return;
    const p = JSON.parse(raw);
    Object.assign(state, p);
    state.collapsedEpics = new Set((p.collapsedEpics ?? []));
  }catch{}
}

function savePrefs(){
  const p = {
    q: state.q,
    epic: state.epic,
    minSp: state.minSp,
    sortBy: state.sortBy,
    viewMode: state.viewMode,
    collapsedEpics: Array.from(state.collapsedEpics),
    theme: state.theme
  };
  localStorage.setItem("backlog_prefs", JSON.stringify(p));
  localStorage.setItem("backlog_theme", state.theme);
}

function applyTheme(){
  document.documentElement.setAttribute("data-theme", state.theme === "light" ? "light" : "dark");
}

/**********************************************************************
 * Filtering + sorting
 **********************************************************************/
function filterRows(){
  const qn = normalize(state.q);
  const minSp = state.minSp ? Number(state.minSp) : null;

  return BACKLOG.filter(r => {
    if(state.epic && r.EPIC_ID !== state.epic) return false;
    if(minSp !== null && Number(r.STORY_POINTS) < minSp) return false;

    if(!qn) return true;
    const hay = normalize([
      r.EPIC_ID, r.EPIC_NAME, r.US_ID, r.US_TITLE, r.USER_STORY, r.AC
    ].join(" || "));
    return hay.includes(qn);
  });
}

function sortRows(rows){
  const arr = [...rows];
  const by = state.sortBy;
  arr.sort((a,b)=>{
    const spA = Number(a.STORY_POINTS), spB = Number(b.STORY_POINTS);
    const tA = normalize(a.US_TITLE), tB = normalize(b.US_TITLE);

    if(by === "sp_desc") return spB - spA || a.US_ID.localeCompare(b.US_ID);
    if(by === "sp_asc") return spA - spB || a.US_ID.localeCompare(b.US_ID);
    if(by === "title_asc") return tA.localeCompare(tB) || a.US_ID.localeCompare(b.US_ID);
    if(by === "title_desc") return tB.localeCompare(tA) || a.US_ID.localeCompare(b.US_ID);

    const e = a.EPIC_ID.localeCompare(b.EPIC_ID);
    return e || a.US_ID.localeCompare(b.US_ID);
  });
  return arr;
}

function groupByEpic(rows){
  const map = new Map();
  for(const r of rows){
    const key = r.EPIC_ID;
    if(!map.has(key)) map.set(key, { epicId: r.EPIC_ID, epicName: r.EPIC_NAME, items: [] });
    map.get(key).items.push(r);
  }
  return Array.from(map.values()).sort((a,b)=> a.epicId.localeCompare(b.epicId));
}

/**********************************************************************
 * Render
 **********************************************************************/
function renderStats(rows){
  const total = rows.length;
  const totalSp = rows.reduce((s,r)=> s + Number(r.STORY_POINTS||0), 0);
  const epics = new Set(rows.map(r=>r.EPIC_ID)).size;
  const avgSp = total ? (totalSp / total) : 0;

  const dist = rows.reduce((m,r)=>{
    const sp = Number(r.STORY_POINTS||0);
    m[sp] = (m[sp]||0)+1;
    return m;
  }, {});
  const topSp = Object.entries(dist).sort((a,b)=> b[1]-a[1])[0];

  const items = [
    {k:"Items filtrés", v: total, hint:"User Stories visibles"},
    {k:"Epics", v: epics, hint:"Epics couverts par le filtre"},
    {k:"Total Story Points", v: totalSp, hint:"Somme SP (filtré)"},
    {k:"SP moyen", v: total ? avgSp.toFixed(2) : "—", hint:"Moyenne par US"},
    {k:"SP le plus fréquent", v: topSp ? topSp[0] : "—", hint: topSp ? `${topSp[1]} US` : "—"},
  ];

  $("#stats").innerHTML = items.map(s=>`
    <div class="stat">
      <div class="k">${escapeHtml(s.k)}</div>
      <div class="v">${escapeHtml(String(s.v))}</div>
      <div class="hint">${escapeHtml(s.hint)}</div>
    </div>
  `).join("");
}

function renderCard(r){
  const ac = acToList(r.AC);
  const acHtml = ac.length
    ? `<ul class="acList">${ac.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>`
    : `<div class="muted">—</div>`;

  return `
    <article class="card">
      <div class="cardTop">
        <div style="min-width:0;">
          <div class="cardId">${escapeHtml(r.US_ID)} · <span class="muted">${escapeHtml(r.EPIC_ID)}</span></div>
          <div class="cardTitle">${escapeHtml(r.US_TITLE)}</div>
        </div>
        <div class="chip sp" title="Story points">${escapeHtml(String(r.STORY_POINTS))} SP</div>
      </div>
      <div class="cardBody">
        <div class="block">
          <div class="h">User Story</div>
          <div class="p">${escapeHtml(r.USER_STORY)}</div>
        </div>
        <div class="block">
          <div class="h">AC</div>
          ${acHtml}
        </div>
      </div>
    </article>
  `;
}

function renderGrouped(rows){
  const groups = groupByEpic(rows);

  const html = groups.map(g=>{
    const spSum = g.items.reduce((s,r)=> s + Number(r.STORY_POINTS||0), 0);
    const isCollapsed = state.collapsedEpics.has(g.epicId);

    return `
      <section class="epic" data-epic="${escapeHtml(g.epicId)}">
        <div class="epicHead" role="button" tabindex="0" aria-expanded="${!isCollapsed}">
          <div class="epicLeft">
            <div class="caret">${isCollapsed ? "＋" : "－"}</div>
            <div class="epicTitle">
              <div class="name">${escapeHtml(g.epicName)}</div>
              <div class="meta">${escapeHtml(g.epicId)}</div>
            </div>
          </div>
          <div class="epicRight">
            <span class="chip count" title="Nombre d'US">${g.items.length} US</span>
            <span class="chip sp" title="Somme Story Points">${spSum} SP</span>
            <button class="btn tiny" data-action="copyEpic" data-epic="${escapeHtml(g.epicId)}" title="Copier ce epic en JSON">📋 Epic JSON</button>
          </div>
        </div>
        <div class="epicBody" style="${isCollapsed ? "display:none;" : ""}">
          <div class="cards">
            ${g.items.map(renderCard).join("")}
          </div>
        </div>
      </section>
    `;
  }).join("");

  $("#content").innerHTML = html || `<div class="muted">Aucun résultat avec les filtres actuels.</div>`;
}

function renderFlat(rows){
  $("#content").innerHTML = rows.length
    ? `<div class="cards">${rows.map(renderCard).join("")}</div>`
    : `<div class="muted">Aucun résultat avec les filtres actuels.</div>`;
}

function render(){
  const filtered = sortRows(filterRows());
  renderStats(filtered);
  if(state.viewMode === "flat") renderFlat(filtered);
  else renderGrouped(filtered);
  savePrefs();
}

/**********************************************************************
 * UI init
 **********************************************************************/
function initEpicSelect(){
  const epics = Array.from(new Map(
    BACKLOG.map(r=> [r.EPIC_ID, r.EPIC_NAME])
  ).entries()).sort((a,b)=> a[0].localeCompare(b[0]));

  const sel = $("#epicSelect");
  sel.innerHTML = `<option value="">Tous</option>` + epics.map(([id,name]) =>
    `<option value="${escapeHtml(id)}">${escapeHtml(id)} — ${escapeHtml(name)}</option>`
  ).join("");
}

function hydrateControls(){
  $("#q").value = state.q || "";
  $("#epicSelect").value = state.epic || "";
  $("#minSp").value = state.minSp || "";
  $("#sortBy").value = state.sortBy || "epic_then_id";
  $("#viewMode").value = state.viewMode || "grouped";
}

function bind(){
  $("#q").addEventListener("input", (e)=> { state.q = e.target.value; render(); });
  $("#epicSelect").addEventListener("change", (e)=> { state.epic = e.target.value; render(); });
  $("#minSp").addEventListener("change", (e)=> { state.minSp = e.target.value; render(); });
  $("#sortBy").addEventListener("change", (e)=> { state.sortBy = e.target.value; render(); });
  $("#viewMode").addEventListener("change", (e)=> { state.viewMode = e.target.value; render(); });

  $("#btnReset").addEventListener("click", ()=>{
    state.q = "";
    state.epic = "";
    state.minSp = "";
    state.sortBy = "epic_then_id";
    state.viewMode = "grouped";
    state.collapsedEpics.clear();

    $("#q").value = "";
    $("#epicSelect").value = "";
    $("#minSp").value = "";
    $("#sortBy").value = "epic_then_id";
    $("#viewMode").value = "grouped";

    toast("Filtres réinitialisés");
    render();
  });

  $("#btnTheme").addEventListener("click", ()=>{
    state.theme = (state.theme === "light") ? "dark" : "light";
    applyTheme();
    toast("Thème changé", state.theme);
    savePrefs();
  });

  $("#btnExportCsv").addEventListener("click", ()=>{
    const rows = sortRows(filterRows());
    downloadText("backlog_filtered.csv", toCsv(rows), "text/csv;charset=utf-8");
    toast("Export CSV", `${rows.length} US`);
  });

  $("#btnCopyJson").addEventListener("click", async ()=>{
    const rows = sortRows(filterRows());
    const ok = await copyToClipboard(JSON.stringify(rows, null, 2));
    toast(ok ? "JSON copié" : "Copie impossible", `${rows.length} US`);
  });

  // Event delegation: epic collapse + copy epic
  $("#content").addEventListener("click", async (e)=>{
    const btn = e.target.closest("[data-action]");
    if(btn){
      const action = btn.getAttribute("data-action");
      if(action === "copyEpic"){
        const epicId = btn.getAttribute("data-epic");
        const rows = sortRows(filterRows()).filter(r => r.EPIC_ID === epicId);
        const ok = await copyToClipboard(JSON.stringify(rows, null, 2));
        toast(ok ? "Epic JSON copié" : "Copie impossible", epicId);
        e.stopPropagation();
        return;
      }
    }

    const head = e.target.closest(".epicHead");
    if(!head) return;
    const section = head.closest(".epic");
    const epicId = section?.getAttribute("data-epic");
    if(!epicId) return;

    if(state.collapsedEpics.has(epicId)) state.collapsedEpics.delete(epicId);
    else state.collapsedEpics.add(epicId);

    render();
  });

  // keyboard shortcuts
  document.addEventListener("keydown", (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      $("#q").focus();
    }
    if(e.key === "/"){
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if(tag !== "input" && tag !== "textarea" && tag !== "select"){
        e.preventDefault();
        $("#q").focus();
      }
    }
    if(e.key === "Escape"){
      if(document.activeElement === $("#q")){
        $("#q").value = "";
        state.q = "";
        render();
        toast("Recherche effacée");
      }
    }
  });

  // CSV manual load
  $("#csvFile").addEventListener("change", async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const text = await file.text();
    BACKLOG = csvToObjects(text);
    initEpicSelect();
    hydrateControls();
    render();
    $("#csvStatus").textContent = `Chargé depuis fichier local : ${file.name} (${BACKLOG.length} lignes).`;
    toast("CSV chargé", `${BACKLOG.length} US`);
  });

  $("#btnReloadCsv").addEventListener("click", async ()=>{
    await loadCsvViaFetch();
  });
}

/**********************************************************************
 * CSV loading
 **********************************************************************/
async function loadCsvViaFetch(){
  const status = $("#csvStatus");
  try{
    status.textContent = "Chargement de backlog.csv…";
    const res = await fetch("./backlog.csv", { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    BACKLOG = csvToObjects(text);
    initEpicSelect();
    hydrateControls();
    render();
    status.textContent = `Chargé via fetch: backlog.csv (${BACKLOG.length} lignes).`;
    toast("CSV chargé", `${BACKLOG.length} US`);
  }catch(err){
    status.textContent = `Impossible de charger backlog.csv via fetch (${err?.message || err}). Utilise le chargeur de fichier ci-dessus ou lance un serveur local.`;
  }
}

/**********************************************************************
 * Boot
 **********************************************************************/
(async function boot(){
  loadPrefs();
  applyTheme();

  $("#generatedAt").textContent = new Date().toLocaleString("fr-FR", { dateStyle:"full", timeStyle:"short" });

  bind();
  await loadCsvViaFetch();
})();
