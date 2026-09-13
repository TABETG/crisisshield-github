package com.crisisshield.crisisshieldbackend.api.dto;

/**
 * DTO (Data Transfer Object) pour la désactivation du MFA.
 * Contient le code TOTP de vérification pour confirmer la désactivation.
 */
public record MfaDisableRequest(
        String code
) {}
