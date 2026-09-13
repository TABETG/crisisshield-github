package com.crisisshield.crisisshieldbackend.api;

import com.crisisshield.crisisshieldbackend.application.UserService;
import com.crisisshield.crisisshieldbackend.api.dto.MfaDisableRequest;
import com.crisisshield.crisisshieldbackend.api.dto.MfaEnableRequest;
import com.crisisshield.crisisshieldbackend.api.dto.MfaSetupResponse;
import com.crisisshield.crisisshieldbackend.api.dto.MfaVerificationRequest;
import com.crisisshield.crisisshieldbackend.domain.User;
import dev.samstevens.totp.exceptions.QrGenerationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mfa")
public class MfaController {

    private final UserService userService;

    public MfaController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/setup")
    public ResponseEntity<MfaSetupResponse> setupMfa(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getUsername();

        // Génère + persist secret
        String secret = userService.generateMfaSecret(username);

        // Recharge pour être sûr d’avoir email/tenant à jour
        User dbUser = userService.getByUsername(username);

        try {
            String qrCodeImageUri = userService.generateQrCodeImageUri(secret, dbUser.getEmail());
            return ResponseEntity.ok(new MfaSetupResponse(secret, qrCodeImageUri));
        } catch (QrGenerationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/enable")
    public ResponseEntity<Void> enableMfa(@AuthenticationPrincipal User principal,
                                          @RequestBody MfaEnableRequest request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (request == null || request.code() == null || request.code().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        User dbUser = userService.getByUsername(principal.getUsername());
        String secret = dbUser.getMfaSecret();

        if (secret == null || secret.isBlank()) {
            return ResponseEntity.badRequest().build(); // setup non fait
        }

        // Optionnel : si ton DTO contient secret, on vérifie qu’il match la DB
        if (request.secret() != null && !request.secret().equals(secret)) {
            return ResponseEntity.badRequest().build();
        }

        boolean ok = userService.enableMfa(dbUser.getUsername(), request.code());
        return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PostMapping("/disable")
    public ResponseEntity<Void> disableMfa(@AuthenticationPrincipal User principal,
                                           @RequestBody MfaDisableRequest request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (request == null || request.code() == null || request.code().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        User dbUser = userService.getByUsername(principal.getUsername());
        String secret = dbUser.getMfaSecret();

        if (secret == null || secret.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean valid = userService.verifyMfaCode(secret, request.code());
        if (!valid) {
            return ResponseEntity.badRequest().build();
        }

        userService.disableMfa(dbUser.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyMfa(@AuthenticationPrincipal User principal,
                                          @RequestBody MfaVerificationRequest request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (request == null || request.code() == null || request.code().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        User dbUser = userService.getByUsername(principal.getUsername());
        String secret = dbUser.getMfaSecret();

        if (secret == null || secret.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean valid = userService.verifyMfaCode(secret, request.code());
        return valid ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
