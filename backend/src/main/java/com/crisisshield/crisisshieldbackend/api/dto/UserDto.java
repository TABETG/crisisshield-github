package com.crisisshield.crisisshieldbackend.api.dto;

import com.crisisshield.crisisshieldbackend.domain.Role;
import com.crisisshield.crisisshieldbackend.domain.User;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * DTO (Data Transfer Object) pour représenter un utilisateur dans les réponses de l'API.
 * Ce DTO garantit que des informations sensibles comme le mot de passe ne sont jamais exposées.
 */
public record UserDto(
        String id,
        String username,
        String email,
        Set<String> roles,
        boolean enabled
) {
    /**
     * Convertit une entité User en son DTO correspondant.
     * @param user L'entité User à convertir.
     * @return Le DTO UserDto.
     */
    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet()),
                user.isEnabled()
        );
    }
}
