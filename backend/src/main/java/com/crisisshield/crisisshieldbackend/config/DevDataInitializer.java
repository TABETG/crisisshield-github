package com.crisisshield.crisisshieldbackend.config;

import com.crisisshield.crisisshieldbackend.application.UserService;
import com.crisisshield.crisisshieldbackend.domain.Organisation;
import com.crisisshield.crisisshieldbackend.domain.OrganisationRepository;
import com.crisisshield.crisisshieldbackend.domain.Role;
import com.crisisshield.crisisshieldbackend.domain.User;
import com.crisisshield.crisisshieldbackend.domain.UserRepository;
import dev.samstevens.totp.exceptions.QrGenerationException;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DevDataInitializer {

    @Bean
    @ConditionalOnProperty(name = "app.dev-data.enabled", havingValue = "true", matchIfMissing = false)
    CommandLineRunner initDevData(
            UserService userService,
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            System.out.println(">>> Exécution DevDataInitializer (app.dev-data.enabled=true)");

            Organisation defaultOrg = organisationRepository.findByName("Default Organisation")
                    .orElseGet(() -> organisationRepository.save(new Organisation("Default Organisation")));

            if (!userRepository.existsByUsername("admin")) {
                User admin = new User(null, "admin", "admin@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_ADMIN),
                        defaultOrg
                );
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">>> User 'admin' (ROLE_ADMIN) créé.");
            } else {
                System.out.println(">>> User 'admin' existe déjà.");
            }

            // Compte miroir de l'utilisateur LDAP (uid=user, mail=user@springframework.org).
            // CustomLdapUserDetailsContextMapper le retrouve par email apres le bind LDAP.
            if (!userRepository.existsByUsername("user")) {
                User ldapUser = new User(null, "user", "user@springframework.org",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_OPS),
                        defaultOrg
                );
                ldapUser.setEnabled(true);
                userRepository.save(ldapUser);
                System.out.println(">>> User 'user' (miroir LDAP, ROLE_OPS) cree.");
            }

            if (!userRepository.existsByUsername("opsuser")) {
                User ops = new User(null, "opsuser", "ops@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_OPS),
                        defaultOrg
                );
                ops.setEnabled(true);
                userRepository.save(ops);
                System.out.println(">>> User 'opsuser' (ROLE_OPS) créé.");
            } else {
                System.out.println(">>> User 'opsuser' existe déjà.");
            }

            if (!userRepository.existsByUsername("mfauser")) {
                User mfaUser = new User(null, "mfauser", "mfa@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_AUDITOR),
                        defaultOrg
                );
                mfaUser.setEnabled(true);
                userRepository.save(mfaUser);

                // 1) Génère + persist le secret en DB
                String secret = userService.generateMfaSecret("mfauser");

                // 2) Active MFA
                User reloaded = userService.getByUsername("mfauser");
                reloaded.setMfaEnabled(true);
                userRepository.save(reloaded);

                System.out.println(">>> User 'mfauser' (ROLE_AUDITOR) créé avec MFA activé.");
                System.out.println("    Secret MFA: " + secret);

                try {
                    String qr = userService.generateQrCodeImageUri(secret, "mfa@crisisshield.com");
                    System.out.println("    QR (data URI) :");
                    System.out.println("    " + qr);
                } catch (QrGenerationException e) {
                    System.out.println("!!! Impossible de générer le QR code: " + e.getMessage());
                }

            } else {
                System.out.println(">>> User 'mfauser' existe déjà.");
            }
        };
    }
}
