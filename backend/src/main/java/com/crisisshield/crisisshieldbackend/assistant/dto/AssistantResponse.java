package com.crisisshield.crisisshieldbackend.assistant.dto;

public record AssistantResponse(
        String answer,
        String provider,
        String code,          // OK, REFUSED_GUARD, RATE_LIMITED
        String reason,
        long latencyMs,
        int maskedEntities
) {
    public boolean ok() { return "OK".equals(code); }

    public static AssistantResponse refused(String provider, String reason) {
        return new AssistantResponse(null, provider, "REFUSED_GUARD", reason, 0, 0);
    }

    public static AssistantResponse rateLimited(String provider) {
        return new AssistantResponse(null, provider, "RATE_LIMITED", "quota de requetes atteint, reessayer plus tard", 0, 0);
    }
}
