package com.crisisshield.crisisshieldbackend.domain;

import org.springframework.security.core.GrantedAuthority;

/**
 * Énumération représentant les rôles des utilisateurs dans le système.
 * Chaque rôle implémente l'interface GrantedAuthority de Spring Security
 * pour une intégration transparente. Le nom du rôle est utilisé comme "autorité".
 */
public enum Role implements GrantedAuthority {
    /**
     * Rôle Administrateur : Accès complet à toutes les fonctionnalités,
     * y compris la gestion des utilisateurs et la configuration du système.
     */
    ROLE_ADMIN,

    /**
     * Rôle Opérationnel (OPS) : Accès aux fonctionnalités métier principales,
     * comme la gestion des crises, mais pas à l'administration des utilisateurs.
     */
    ROLE_OPS,

    /**
     * Rôle Auditeur : Accès en lecture seule aux journaux d'audit et aux rapports
     * pour la surveillance et la conformité.
     */
    ROLE_AUDITOR;

    /**
     * Retourne le nom de l'énumération comme autorité pour Spring Security.
     * Par exemple, pour ROLE_ADMIN, l'autorité est "ROLE_ADMIN".
     *
     * @return Le nom du rôle en tant que chaîne de caractères.
     */
    @Override
    public String getAuthority() {
        return name();
    }
}
