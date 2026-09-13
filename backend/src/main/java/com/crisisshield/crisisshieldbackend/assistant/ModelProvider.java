package com.crisisshield.crisisshieldbackend.assistant;

/**
 * EP18-US02 : abstraction du fournisseur de modele.
 * Une seule implementation est active a la fois (propriete app.assistant.provider).
 * Bedrock ou un fournisseur externe se branchent ici sans toucher au reste.
 */
public interface ModelProvider {

    String name();

    String complete(String systemPrompt, String userPrompt);
}
