package com.crisisshield.crisisshieldbackend.infrastructure.security;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrDataFactory;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration des beans pour la gestion du TOTP (Time-based One-Time Password).
 * Cette classe configure explicitement les composants de la bibliothèque `totp-spring-boot-starter`
 * pour s'assurer que Spring les initialise correctement et les rend disponibles pour injection.
 */
@Configuration
public class TotpConfig {

    /**
     * Fournit un générateur de secrets TOTP.
     * Utilisé pour créer de nouveaux secrets aléatoires pour les utilisateurs.
     */
    @Bean
    public SecretGenerator secretGenerator() {
        return new DefaultSecretGenerator();
    }

    /**
     * Fournit un générateur de codes TOTP.
     * Utilisé en interne par le CodeVerifier.
     */
    @Bean
    public CodeGenerator codeGenerator() {
        return new DefaultCodeGenerator();
    }

    /**
     * Fournit un fournisseur de temps système.
     * Nécessaire pour la vérification des codes TOTP.
     */
    @Bean
    public TimeProvider timeProvider() {
        return new SystemTimeProvider();
    }

    /**
     * Fournit un vérificateur de codes TOTP.
     * Utilisé pour valider les codes TOTP fournis par les utilisateurs.
     * Il est crucial que ce bean soit correctement configuré avec un CodeGenerator et un TimeProvider.
     */
    @Bean
    public CodeVerifier codeVerifier(CodeGenerator codeGenerator, TimeProvider timeProvider) {
        // Le constructeur de DefaultCodeVerifier prend bien un CodeGenerator et un TimeProvider.
        // L'erreur "cannot find symbol method isValid" est souvent liée à une mauvaise résolution
        // de la dépendance ou à un problème de classpath/cache.
        return new DefaultCodeVerifier(codeGenerator, timeProvider);
    }

    /**
     * Fournit une fabrique de données QR.
     * Utilisée pour construire les objets QrData nécessaires à la génération des QR codes.
     * Les valeurs par défaut (HashingAlgorithm.SHA1, 6 digits, 30 seconds period) sont utilisées.
     */
    @Bean
    public QrDataFactory qrDataFactory() {
        // Le constructeur de QrDataFactory nécessite HashingAlgorithm, digits et period.
        // Utilisation des valeurs par défaut standard pour TOTP.
        return new QrDataFactory(HashingAlgorithm.SHA1, 6, 30);
    }

    /**
     * Fournit un générateur de QR codes.
     * Utilisé pour transformer les données QR en images (par exemple, PNG).
     */
    @Bean
    public QrGenerator qrGenerator() {
        return new ZxingPngQrGenerator();
    }
}
