package com.crisisshield.crisisshieldbackend.api.dto;

import com.crisisshield.crisisshieldbackend.domain.Organisation;
import com.crisisshield.crisisshieldbackend.domain.Role;
import com.crisisshield.crisisshieldbackend.domain.User;

import java.util.Set;

/**
 * DTO pour la mise à jour d'un utilisateur existant.
 * Le mot de passe est optionnel.
 */
public record UserUpdateDto(
        String username,
        String email,
        String password, // Optionnel: ne sera mis à jour que s'il est fourni
        Set<Role> roles,
        boolean enabled,
        String organisationId // Ajout de l'ID de l'organisation
) {
    /**
     * Applique les modifications de ce DTO à une entité User existante.
     * @param user L'entité User à mettre à jour.
     * @param organisation L'organisation à associer.
     */
    public void applyTo(User user, Organisation organisation) {
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setRoles(this.roles);
        user.setEnabled(this.enabled);
        user.setOrganisation(organisation);
        // Ne met à jour le mot de passe que s'il est fourni
        if (this.password != null && !this.password.isEmpty()) {
            user.setPassword(this.password);
        }
    }
}
