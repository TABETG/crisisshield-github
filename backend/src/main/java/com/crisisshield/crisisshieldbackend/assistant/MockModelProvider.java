package com.crisisshield.crisisshieldbackend.assistant;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Fournisseur simule : permet de developper et tester toute la chaine
 * (authentification, filtrage, journalisation) sans appel reseau ni cout.
 */
@Component
@ConditionalOnProperty(name = "app.assistant.provider", havingValue = "mock", matchIfMissing = true)
public class MockModelProvider implements ModelProvider {

    @Override
    public String name() {
        return "mock";
    }

    @Override
    public String complete(String systemPrompt, String userPrompt) {
        return "[mock] Reponse simulee a : " + userPrompt;
    }
}
