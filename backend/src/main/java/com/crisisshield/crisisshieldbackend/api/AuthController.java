package com.crisisshield.crisisshieldbackend.api;
import com.crisisshield.crisisshieldbackend.api.dto.LoginRequest;
import com.crisisshield.crisisshieldbackend.api.dto.LoginResponse;
import com.crisisshield.crisisshieldbackend.application.UserService;


import com.crisisshield.crisisshieldbackend.domain.User;
import com.crisisshield.crisisshieldbackend.infrastructure.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Contrôleur gérant l'authentification des utilisateurs.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authentifie un utilisateur et retourne un token JWT.
     * Gère également la vérification MFA si activée pour l'utilisateur.
     *
     * @param loginRequest Les informations de connexion (nom d'utilisateur, mot de passe, et code MFA optionnel).
     * @return Une réponse contenant le token JWT si l'authentification réussit.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Authentification par nom d'utilisateur et mot de passe
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final User userDetails = userService.getByUsername(loginRequest.username());

        // 2. Vérification MFA si activée
        if (userDetails.isMfaEnabled()) {
            if (loginRequest.mfaCode() == null || !userService.verifyMfaCode(userDetails.getMfaSecret(), loginRequest.mfaCode())) {
                // Si MFA activé mais code manquant ou invalide
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Ou un statut plus spécifique comme 403 Forbidden
            }
        } else {
            // Si MFA n'est pas activé mais un code est fourni, on l'ignore ou on renvoie une erreur si on veut être strict
            if (loginRequest.mfaCode() != null && !loginRequest.mfaCode().isEmpty()) {
                // Optionnel: logguer un avertissement ou renvoyer une erreur si un code MFA est fourni sans MFA activé
                // Pour l'instant, nous l'ignorons.
            }
        }

        // 3. Génération du token JWT
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}
