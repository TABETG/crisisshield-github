package com.crisisshield.crisisshieldbackend.infrastructure.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * EP02-US06 : publication de la cle publique au format JWKS (RFC 7517).
 * Tout service interne peut verifier un jeton CrisisShield sans partager de secret.
 */
@RestController
public class JwksController {

    private final JwtUtil jwtUtil;

    public JwksController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> jwks() {
        RSAPublicKey key = jwtUtil.getRsaPublicKey();
        return Map.of("keys", List.of(Map.of(
                "kty", "RSA",
                "use", "sig",
                "alg", "RS256",
                "kid", jwtUtil.getKeyId(),
                "n", base64Url(key.getModulus()),
                "e", base64Url(key.getPublicExponent())
        )));
    }

    private static String base64Url(BigInteger value) {
        byte[] bytes = value.toByteArray();
        if (bytes.length > 1 && bytes[0] == 0) {           // retire l'octet de signe
            byte[] sans = new byte[bytes.length - 1];
            System.arraycopy(bytes, 1, sans, 0, sans.length);
            bytes = sans;
        }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
