package com.crisisshield.crisisshieldbackend.domain;

import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * EP03-US05 : preuve que le filtre par organisation ne laisse rien passer.
 * Deux organisations, trois utilisateurs. Filtre actif sur A : on ne voit que A. Filtre inactif : on voit tout.
 * Ce test protege le mecanisme central du multi-locataire (EP03-US03). S'il casse, tout le reste est compromis.
 */
@DataJpaTest
@TestPropertySource(properties = "spring.flyway.enabled=false")   // H2 : schema genere, migrations PostgreSQL non applicables
class TenantIsolationTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Test
    @DisplayName("Avec le filtre actif, une organisation ne voit que ses propres utilisateurs")
    void filtreActif() {
        Organisation a = organisationRepository.save(new Organisation("Org A"));
        Organisation b = organisationRepository.save(new Organisation("Org B"));
        userRepository.save(new User(null, "alice", "alice@a.test", "x", Set.of(Role.ROLE_OPS), a));
        userRepository.save(new User(null, "anna", "anna@a.test", "x", Set.of(Role.ROLE_OPS), a));
        userRepository.save(new User(null, "bob", "bob@b.test", "x", Set.of(Role.ROLE_OPS), b));
        entityManager.flush();
        entityManager.clear();

        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("orgFilter").setParameter("orgId", a.getId());
        try {
            List<User> visibles = userRepository.findAll();
            assertThat(visibles).extracting(User::getUsername).containsExactlyInAnyOrder("alice", "anna");
            assertThat(visibles).extracting(User::getOrganisationId).containsOnly(a.getId());
        } finally {
            session.disableFilter("orgFilter");
        }
    }

    @Test
    @DisplayName("Avec le filtre actif sur B, l'utilisateur de A est invisible meme par son identifiant")
    void accesDirectRefuse() {
        Organisation a = organisationRepository.save(new Organisation("Org A"));
        Organisation b = organisationRepository.save(new Organisation("Org B"));
        User alice = userRepository.save(new User(null, "alice", "alice@a.test", "x", Set.of(Role.ROLE_OPS), a));
        entityManager.flush();
        entityManager.clear();

        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("orgFilter").setParameter("orgId", b.getId());
        try {
            // findAll respecte le filtre ; c'est la voie que doivent emprunter les services metier
            assertThat(userRepository.findAll()).extracting(User::getUsername).doesNotContain("alice");
            assertThat(userRepository.findByUsername("alice")).isEmpty();
        } finally {
            session.disableFilter("orgFilter");
        }
        assertThat(alice.getId()).isNotNull();
    }

    @Test
    @DisplayName("Sans filtre, tout est visible : le filtre est bien la seule barriere, il doit donc toujours etre actif")
    void sansFiltre() {
        Organisation a = organisationRepository.save(new Organisation("Org A"));
        Organisation b = organisationRepository.save(new Organisation("Org B"));
        userRepository.save(new User(null, "alice", "alice@a.test", "x", Set.of(Role.ROLE_OPS), a));
        userRepository.save(new User(null, "bob", "bob@b.test", "x", Set.of(Role.ROLE_OPS), b));
        entityManager.flush();
        entityManager.clear();

        assertThat(userRepository.findAll()).hasSize(2);
    }
}
