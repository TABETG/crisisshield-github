package com.crisisshield.crisisshieldbackend.assistant;

import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * EP18-US04 : aucune donnee personnelle ne part chez le fournisseur du modele.
 * Chaque entite detectee est remplacee par un marqueur stable ([[EMAIL_1]], [[TELEPHONE_2]]...),
 * identique pour une meme valeur au sein d'une meme requete, puis restauree dans la reponse.
 * Le modele raisonne sur la structure sans jamais voir la valeur.
 *
 * Version 1, par expressions regulieres : courriel, telephone francais, IBAN, numero de securite sociale.
 * Les noms de personnes ne sont pas couverts ici : c'est le role d'un detecteur d'entites nommees
 * (Presidio ou equivalent), prevu en version 2. Limite documentee, pas cachee.
 */
@Component
public class PiiMasker {

    public record Masked(String text, Map<String, String> markers) {

        public int count() { return markers.size(); }

        /** Restaure les valeurs reelles dans un texte produit par le modele. */
        public String restore(String output) {
            if (output == null) return null;
            String result = output;
            for (Map.Entry<String, String> e : markers.entrySet()) {
                result = result.replace(e.getKey(), e.getValue());
            }
            return result;
        }
    }

    private record Detector(String label, Pattern pattern) {}

    /** L'ordre compte : les motifs longs (IBAN, NIR) avant les courts (telephone) pour eviter les recouvrements. */
    private static final List<Detector> DETECTORS = List.of(
            new Detector("IBAN", Pattern.compile("\\bFR\\d{2}(?:[ ]?[A-Z0-9]{4}){5}[ ]?[A-Z0-9]{1,3}\\b")),
            new Detector("NIR", Pattern.compile("\\b[12][ ]?\\d{2}[ ]?(?:0[1-9]|1[0-2])[ ]?\\d{2}[ ]?\\d{3}[ ]?\\d{3}(?:[ ]?\\d{2})?\\b")),
            new Detector("EMAIL", Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")),
            new Detector("TELEPHONE", Pattern.compile("(?:\\+33[ .-]?|\\b0)[1-9](?:[ .-]?\\d{2}){4}\\b"))
    );

    public Masked mask(String text) {
        if (text == null || text.isBlank()) {
            return new Masked(text, Map.of());
        }
        Map<String, String> markers = new LinkedHashMap<>();   // marqueur -> valeur reelle
        Map<String, String> reverse = new LinkedHashMap<>();   // valeur reelle -> marqueur
        String current = text;
        for (Detector d : DETECTORS) {
            Matcher m = d.pattern().matcher(current);
            StringBuilder sb = new StringBuilder();
            int counter = 0;
            while (m.find()) {
                String value = m.group();
                String marker = reverse.get(value);
                if (marker == null) {
                    counter++;
                    marker = "[[" + d.label() + "_" + counter + "]]";
                    reverse.put(value, marker);
                    markers.put(marker, value);
                }
                m.appendReplacement(sb, Matcher.quoteReplacement(marker));
            }
            m.appendTail(sb);
            current = sb.toString();
        }
        return new Masked(current, markers);
    }
}
