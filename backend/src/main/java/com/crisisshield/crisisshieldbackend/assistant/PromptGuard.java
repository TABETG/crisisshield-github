package com.crisisshield.crisisshieldbackend.assistant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * EP18-US03 et EP18-US07 : premiere couche de defense, volontairement simple et honnete.
 * Elle bloque les motifs connus et la taille excessive. Elle ne pretend pas tout bloquer : le banc d'essai
 * (PromptGuardBenchTest) mesure le taux reel de detection, et ce taux est assume dans le modele de menace.
 * La vraie protection reste le principe de moindre capacite (EP18-US05) : une injection qui passe ne peut rien faire.
 */
@Component
public class PromptGuard {

    public record Verdict(boolean allowed, String reason) {
        public static Verdict ok() { return new Verdict(true, "ok"); }
        public static Verdict refused(String reason) { return new Verdict(false, reason); }
    }

    private static final List<Pattern> MOTIFS_INJECTION = List.of(
            // consignes de contournement, anglais et francais
            Pattern.compile("ignore\\s+(?:all\\s+|any\\s+)?(?:previous|prior|above|earlier)\\s+(?:instructions|rules|prompts?)"),
            Pattern.compile("(?:ignore|oublie|oubliez|ignorez)\\s+(?:toutes?\\s+)?(?:les|tes|vos)\\s+(?:instructions|regles|consignes)"),
            Pattern.compile("disregard\\s+(?:all\\s+)?(?:previous|prior|the)\\s+(?:instructions|rules)"),
            // extraction du prompt systeme
            Pattern.compile("(?:reveal|print|show|display|repeat|output|affiche|montre|revele|repete|donne)[\\s-]+(?:me[\\s-]+|moi[\\s-]+)?(?:the\\s+|your\\s+|le\\s+|ton\\s+|tes\\s+)?(?:system\\s+|initial\\s+|hidden\\s+)?(?:prompt|instructions|consignes)"),
            Pattern.compile("what\\s+(?:is|are)\\s+your\\s+(?:system\\s+)?(?:prompt|instructions)"),
            Pattern.compile("quel(?:les)?\\s+(?:est|sont)\\s+(?:ton|tes)\\s+(?:prompt|instructions|consignes)"),
            // changement d'identite ou de mode
            Pattern.compile("you\\s+are\\s+now\\s+(?:a|an|the|in)\\s+"),
            Pattern.compile("tu\\s+es\\s+(?:maintenant|desormais)\\s+(?:un|une|en)\\s+"),
            Pattern.compile("(?:developer|god|jailbreak|unrestricted|dan)\\s+mode"),
            Pattern.compile("mode\\s+(?:developpeur|sans\\s+restriction|libre)"),
            Pattern.compile("act\\s+as\\s+(?:if\\s+you\\s+(?:have|had)\\s+no|an?\\s+unrestricted)"),
            Pattern.compile("(?:pretend|imagine)\\s+(?:that\\s+)?you\\s+(?:have\\s+no|are\\s+not\\s+bound)"),
            // separateurs de prompt injectes
            Pattern.compile("(?:^|\\n)\\s*(?:system|assistant|###\\s*instruction)\\s*:"),
            Pattern.compile("<\\s*/?\\s*(?:system|instructions?)\\s*>")
    );

    private final int maxPromptChars;

    public PromptGuard(@Value("${app.assistant.max-prompt-chars:4000}") int maxPromptChars) {
        this.maxPromptChars = maxPromptChars;
    }

    public Verdict inspectInput(String text) {
        if (text == null || text.isBlank()) {
            return Verdict.refused("question vide");
        }
        if (text.length() > maxPromptChars) {
            return Verdict.refused("question trop longue (" + text.length() + " > " + maxPromptChars + ")");
        }
        String normalise = normalise(text);
        for (Pattern p : MOTIFS_INJECTION) {
            if (p.matcher(normalise).find()) {
                return Verdict.refused("motif d'injection detecte");
            }
        }
        return Verdict.ok();
    }

    /** Controle de sortie : la reponse est une donnee hostile. On refuse de restituer le prompt systeme. */
    public String sanitizeOutput(String text, String systemPrompt) {
        if (text == null) {
            return "";
        }
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            String t = normalise(text);
            String s = normalise(systemPrompt);
            // fuite integrale, ou fuite d'un fragment significatif (premiere phrase)
            String premiere = s.lines().filter(l -> !l.isBlank()).findFirst().orElse(s).trim();
            if (t.contains(s.trim()) || (premiere.length() > 20 && t.contains(premiere))) {
                return "[reponse bloquee : fuite du prompt systeme]";
            }
        }
        return text;
    }

    /** Minuscules, sans accents, espaces multiples reduits : rend les motifs robustes aux variantes. */
    static String normalise(String text) {
        String sansAccents = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return sansAccents.toLowerCase(Locale.ROOT).replaceAll("[ \\t]+", " ");
    }
}
