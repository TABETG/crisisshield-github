package com.crisisshield.crisisshieldbackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Classe de test d'intégration pour l'application Spring Boot.
 * Elle charge le contexte Spring complet pour vérifier que tous les composants
 * sont correctement configurés et peuvent démarrer.
 */
@SpringBootTest
@ActiveProfiles("test") // Active le profil "test" pour utiliser application-test.properties
class CrisisShieldBackendApplicationTests {

    @Test
    void contextLoads() {
        // Ce test vérifie simplement que le contexte Spring peut se charger sans erreur.
        // La logique métier est testée dans UserServiceTest.
    }

}
