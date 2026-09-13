package com.crisisshield.crisisshieldbackend.api.dto;

/**
 * DTO (Data Transfer Object) pour l'activation du MFA.
 * Contient le secret TOTP et le code de vérification fourni par l'utilisateur.
 */
public record MfaEnableRequest(
        String secret,
        String code
) {}
