package com.crisisshield.crisisshieldbackend.api.dto;

/**
 * DTO (Data Transfer Object) pour la vérification d'un code TOTP.
 * Utilisé pour envoyer le code TOTP fourni par l'utilisateur au serveur.
 */
public record MfaVerificationRequest(
        String code
) {}
