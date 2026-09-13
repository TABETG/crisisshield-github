package com.crisisshield.crisisshieldbackend.infrastructure.security;

import com.crisisshield.crisisshieldbackend.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;
import java.util.function.Function;

/**
 * EP02-US06 : jetons signes en RS256.
 * - La cle privee ne sert qu'a signer, ici. Personne d'autre ne l'a.
 * - La cle publique est exposee en JWKS ({@link JwksController}) : tout service peut verifier, aucun ne peut forger.
 * - L'emetteur et l'audience sont imposes a la verification (EP02-US09 : tests negatifs).
 * - L'algorithme est impose par la cle, jamais lu dans l'en-tete du jeton (confusion d'algorithme, cours chap. 3.3).
 *
 * En developpement, sans chemin de cle configure, une paire est generee au demarrage : les jetons ne survivent
 * pas a un redemarrage, c'est voulu. En production, la cle privee vient de KMS ou d'un HSM (EP09).
 */
@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    public static final String ISSUER = "crisisshield";
    public static final String AUDIENCE = "crisisshield-api";
    public static final long CLOCK_SKEW_SECONDS = 5;

    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final long expiration;
    private final String keyId;

    @Autowired
    public JwtUtil(@Value("${jwt.private-key-path:}") String privateKeyPath,
                   @Value("${jwt.public-key-path:}") String publicKeyPath,
                   @Value("${jwt.expiration}") long expiration) {
        this(loadOrGenerate(privateKeyPath, publicKeyPath), expiration);
    }

    /** Constructeur direct, pour les tests. */
    public JwtUtil(KeyPair keyPair, long expiration) {
        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
        this.expiration = expiration;
        this.keyId = computeKeyId(publicKey);
    }

    // ---- generation ----

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof User u && u.getOrganisation() != null) {
            claims.put("organisationId", u.getOrganisation().getId());
        }
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setHeaderParam("kid", keyId)
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuer(ISSUER)
                .setAudience(AUDIENCE)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiration))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    // ---- verification ----

    /** Leve JwtException si le jeton est invalide pour quelque raison que ce soit. */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(parse(token));
    }

    /** Ne leve jamais : renvoie false sur tout jeton invalide, expire, mal signe ou mal adresse. */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = parse(token);
            return claims.getSubject() != null && claims.getSubject().equals(userDetails.getUsername());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)          // impose RS256 : un jeton HS256 ou "none" est rejete
                .requireIssuer(ISSUER)
                .requireAudience(AUDIENCE)
                .setAllowedClockSkewSeconds(CLOCK_SKEW_SECONDS)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ---- exposition de la cle publique ----

    public PublicKey getPublicKey() { return publicKey; }

    public String getKeyId() { return keyId; }

    public RSAPublicKey getRsaPublicKey() {
        if (publicKey instanceof RSAPublicKey rsa) {
            return rsa;
        }
        throw new IllegalStateException("La cle publique n'est pas une cle RSA");
    }

    // ---- chargement ----

    private static KeyPair loadOrGenerate(String privateKeyPath, String publicKeyPath) {
        if (privateKeyPath != null && !privateKeyPath.isBlank()
                && publicKeyPath != null && !publicKeyPath.isBlank()) {
            try {
                KeyFactory kf = KeyFactory.getInstance("RSA");
                PrivateKey priv = kf.generatePrivate(new PKCS8EncodedKeySpec(readPem(Path.of(privateKeyPath))));
                PublicKey pub = kf.generatePublic(new X509EncodedKeySpec(readPem(Path.of(publicKeyPath))));
                log.info("Cles JWT chargees depuis {} et {}", privateKeyPath, publicKeyPath);
                return new KeyPair(pub, priv);
            } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
                throw new IllegalStateException("Impossible de charger les cles JWT : " + e.getMessage(), e);
            }
        }
        log.warn("Aucune cle JWT configuree : paire RSA generee au demarrage (developpement uniquement, "
                + "les jetons ne survivent pas a un redemarrage). Configurer jwt.private-key-path / jwt.public-key-path.");
        return Keys.keyPairFor(SignatureAlgorithm.RS256);
    }

    private static byte[] readPem(Path path) throws IOException {
        String pem = Files.readString(path, StandardCharsets.US_ASCII)
                .replaceAll("-----BEGIN [A-Z ]+-----", "")
                .replaceAll("-----END [A-Z ]+-----", "")
                .replaceAll("\\s", "");
        return Base64.getDecoder().decode(pem);
    }

    private static String computeKeyId(PublicKey key) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(key.getEncoded());
            return HexFormat.of().formatHex(digest, 0, 8);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
