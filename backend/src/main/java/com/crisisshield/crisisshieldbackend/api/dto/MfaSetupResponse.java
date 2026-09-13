package com.crisisshield.crisisshieldbackend.api.dto;

/**
 * DTO (Data Transfer Object) pour la réponse de configuration du MFA.
 * Contient le secret TOTP généré et l'URI de l'image QR code pour l'enregistrement.
 */
public record MfaSetupResponse(
        String secret,
        String qrCodeImageUri
) {}
