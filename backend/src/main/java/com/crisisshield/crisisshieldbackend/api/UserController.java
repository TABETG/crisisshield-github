package com.crisisshield.crisisshieldbackend.api;
import com.crisisshield.crisisshieldbackend.application.UserService;


import com.crisisshield.crisisshieldbackend.api.dto.UserCreateDto;
import com.crisisshield.crisisshieldbackend.api.dto.UserDto;
import com.crisisshield.crisisshieldbackend.api.dto.UserUpdateDto;
import com.crisisshield.crisisshieldbackend.domain.Organisation;
import com.crisisshield.crisisshieldbackend.domain.OrganisationRepository;
import com.crisisshield.crisisshieldbackend.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur REST pour la gestion des utilisateurs (CRUD).
 * L'accès à ce contrôleur est restreint aux administrateurs.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final OrganisationRepository organisationRepository;

    public UserController(UserService userService, OrganisationRepository organisationRepository) {
        this.userService = userService;
        this.organisationRepository = organisationRepository;
    }

    /**
     * Récupère la liste de tous les utilisateurs.
     * @return Une liste de UserDto.
     */
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAllUsers().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param id L'ID de l'utilisateur.
     * @return Un UserDto si trouvé, sinon 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return userService.findUserById(id)
                .map(UserDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crée un nouvel utilisateur.
     * @param userCreateDto Le DTO de création d'utilisateur.
     * @return Le UserDto de l'utilisateur créé.
     */
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreateDto userCreateDto) {
        Organisation organisation = organisationRepository.findById(userCreateDto.organisationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organisation non trouvée"));

        User userToCreate = userCreateDto.toEntity(organisation);
        UserDto createdUser = UserDto.fromEntity(userService.createUser(userToCreate));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Met à jour un utilisateur existant.
     * @param id L'ID de l'utilisateur à mettre à jour.
     * @param userUpdateDto Le DTO de mise à jour.
     * @return Le UserDto de l'utilisateur mis à jour, ou 404 si non trouvé.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String id, @RequestBody UserUpdateDto userUpdateDto) {
        User existingUser = userService.findUserById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        Organisation organisation = organisationRepository.findById(userUpdateDto.organisationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organisation non trouvée"));

        userUpdateDto.applyTo(existingUser, organisation);

        User updatedUser = userService.updateUser(id, existingUser);
        UserDto updatedUserDto = UserDto.fromEntity(updatedUser);
        return ResponseEntity.ok(updatedUserDto);
    }

    /**
     * Supprime un utilisateur.
     * @param id L'ID de l'utilisateur à supprimer.
     * @return 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
