package com.crisisshield.crisisshieldbackend.api.dto;

import com.crisisshield.crisisshieldbackend.domain.Organisation;
import com.crisisshield.crisisshieldbackend.domain.Role;
import com.crisisshield.crisisshieldbackend.domain.User;

import java.util.Set;

/**
 * DTO pour la création d'un nouvel utilisateur.
 * Contient les champs nécessaires pour créer un utilisateur, y compris le mot de passe et l'ID de l'organisation.
 */
public record UserCreateDto(
        String username,
        String email,
        String password,
        Set<Role> roles,
        String organisationId // Ajout de l'ID de l'organisation
) {
    /**
     * Convertit ce DTO en une entité User.
     * @param organisation L'entité Organisation à associer à l'utilisateur.
     * @return L'entité User prête à être sauvegardée.
     */
    public User toEntity(Organisation organisation) {
        return new User(
                null, // L'ID sera généré par la base de données
                this.username,
                this.email,
                this.password,
                this.roles,
                organisation // Association de l'organisation
        );
    }
}
