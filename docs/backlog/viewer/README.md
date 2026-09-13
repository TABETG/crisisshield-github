# Backlog Viewer (HTML + CSS + JS + CSV)

## Structure
- index.html
- styles.css
- app.js
- backlog.csv

## Lancer en local (recommandé)
Certains navigateurs bloquent `fetch()` en ouvrant directement `index.html` en `file://`.

### Option 1 — Python
```bash
cd backlog_viewer
python -m http.server 8080
```
Puis ouvre: http://localhost:8080

### Option 2 — Node (si tu as)
```bash
npx serve .
```

## Modifier le backlog
Édite `backlog.csv` (colonnes attendues):
EPIC_ID, EPIC_NAME, US_ID, US_TITLE, USER_STORY, STORY_POINTS, AC
