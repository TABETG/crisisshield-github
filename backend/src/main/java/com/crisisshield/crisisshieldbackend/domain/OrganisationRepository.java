package com.crisisshield.crisisshieldbackend.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Interface de dépôt pour l'entité Organisation.
 * Étend JpaRepository pour bénéficier des opérations CRUD de base
 * et des méthodes de recherche personnalisées fournies par Spring Data JPA.
 * L'annotation @Repository indique à Spring que cette interface est un bean de dépôt.
 */
@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, String> {
    
    /**
     * Recherche une organisation par son nom.
     * Spring Data JPA générera automatiquement l'implémentation de cette méthode.
     *
     * @param name Le nom de l'organisation à rechercher.
     * @return Un Optional contenant l'organisation si elle est trouvée, sinon un Optional vide.
     */
    Optional<Organisation> findByName(String name);
}
