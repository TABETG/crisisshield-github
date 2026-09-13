package com.crisisshield.crisisshieldbackend;

// Supprimez les imports liés à CommandLineRunner, User, Role, UserRepository, UserService, PasswordEncoder, Environment
// import com.crisisshield.crisisshieldbackend.application.UserService;
// import com.crisisshield.crisisshieldbackend.domain.Role;
// import com.crisisshield.crisisshieldbackend.domain.User;
// import com.crisisshield.crisisshieldbackend.domain.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.boot.CommandLineRunner; // Supprimez cet import
// import org.springframework.context.annotation.Bean; // Supprimez cet import si plus aucun @Bean n'est défini ici
// import org.springframework.context.annotation.Profile; // Supprimez cet import si plus aucun @Profile n'est utilisé ici
// import org.springframework.core.env.Environment; // Supprimez cet import
// import org.springframework.security.crypto.password.PasswordEncoder; // Supprimez cet import

// import java.util.Set; // Supprimez cet import si plus utilisé

@SpringBootApplication
public class CrisisShieldBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrisisShieldBackendApplication.class, args);
    }

    // Supprimez complètement le bean CommandLineRunner :
    /*
    @Bean
    CommandLineRunner run(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder, Environment environment) {
        return args -> {
            if (environment.acceptsProfiles(org.springframework.core.env.Profiles.of("ldap"))) {
                System.out.println(">>> Profil 'ldap' actif. Le CommandLineRunner de création d'utilisateurs par défaut est désactivé.");
                return;
            }
            
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = new User(
                        null,
                        "admin",
                        "admin@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_ADMIN)
                );
                userRepository.save(adminUser);
                System.out.println(">>> Utilisateur de test 'admin' avec le rôle ADMIN créé.");
            } else {
                System.out.println(">>> Utilisateur 'admin' existe déjà, création ignorée.");
            }

            if (!userRepository.existsByUsername("opsuser")) {
                User opsUser = new User(
                        null,
                        "opsuser",
                        "ops@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_OPS)
                );
                userRepository.save(opsUser);
                System.out.println(">>> Utilisateur de test 'opsuser' avec le rôle OPS créé.");
            } else {
                System.out.println(">>> Utilisateur 'opsuser' existe déjà, création ignorée.");
            }

            if (!userRepository.existsByUsername("mfauser")) {
                User mfaUserBase = new User(
                        null,
                        "mfauser",
                        "mfa@crisisshield.com",
                        passwordEncoder.encode("password"),
                        Set.of(Role.ROLE_AUDITOR)
                );
                userRepository.save(mfaUserBase);

                String mfaSecret = userService.generateMfaSecret(mfaUserBase.getUsername())
                        .orElseThrow(() -> new RuntimeException("Impossible de générer le secret MFA pour mfauser."));

                User mfaUserFinal = userRepository.findByUsername(mfaUserBase.getUsername())
                        .orElseThrow(() -> new RuntimeException("mfauser non trouvé après génération du secret."));
                mfaUserFinal.setMfaEnabled(true);
                mfaUserFinal.setMfaSecret(mfaSecret);
                userRepository.save(mfaUserFinal);

                System.out.println(">>> Utilisateur de test 'mfauser' avec le rôle AUDITOR et MFA activé créé.");
                System.out.println("    Secret MFA pour 'mfauser': " + mfaSecret);
                System.out.println("    Scannez ce QR code avec votre application d'authentification:");
                System.out.println("    " + userService.generateQrCodeImageUri("mfauser", mfaSecret));
            } else {
                System.out.println(">>> Utilisateur 'mfauser' existe déjà, création ignorée.");
            }
        };
    }
    */
}
