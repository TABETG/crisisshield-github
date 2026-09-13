package com.crisisshield.crisisshieldbackend.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Interface de dépôt pour l'entité User.
 * Étend JpaRepository pour bénéficier des opérations CRUD de base
 * et des méthodes de recherche personnalisées fournies par Spring Data JPA.
 */
public interface UserRepository extends JpaRepository<User, String> {
    // Spring Data JPA va automatiquement implémenter cette méthode
    Optional<User> findByUsername(String username);

    /**
     * Recherche un utilisateur par son adresse e-mail.
     * C'est une méthode cruciale pour lier un utilisateur LDAP (via son email)
     * à un utilisateur dans la base de données locale.
     *
     * @param email L'adresse email de l'utilisateur à rechercher.
     * @return un Optional contenant l'utilisateur s'il est trouvé, sinon un Optional vide.
     */
    Optional<User> findByEmail(String email);

    /**
     * Vérifie si un utilisateur avec l'email donné existe déjà dans la base de données.
     * Spring Data JPA générera automatiquement l'implémentation de cette méthode.
     *
     * @param email L'adresse email à vérifier.
     * @return true si un utilisateur avec cet email existe, false sinon.
     */
    boolean existsByEmail(String email);

    /**
     * Vérifie si un utilisateur avec le nom d'utilisateur donné existe déjà dans la base de données.
     * Spring Data JPA générera automatiquement l'implémentation de cette méthode.
     *
     * @param username Le nom d'utilisateur à vérifier.
     * @return true si un utilisateur avec ce nom d'utilisateur existe, false sinon.
     */
    boolean existsByUsername(String username);
}
