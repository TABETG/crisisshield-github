package com.crisisshield.crisisshieldbackend.infrastructure.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.util.Base64;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * EP02-US09 : la validation d'un jeton ne doit jamais regresser.
 * Tout le monde teste que le bon jeton passe. Ces tests verifient que les mauvais sont rejetes.
 */
class JwtUtilTest {

    private static KeyPair keyPair;
    private static JwtUtil jwtUtil;
    private static final UserDetails ALICE = User.withUsername("alice").password("x").roles("OPS").build();
    private static final UserDetails BOB = User.withUsername("bob").password("x").roles("OPS").build();

    @BeforeAll
    static void setUp() {
        keyPair = Keys.keyPairFor(SignatureAlgorithm.RS256);
        jwtUtil = new JwtUtil(keyPair, 60_000);
    }

    @Test
    @DisplayName("Un jeton valide est accepte et porte le bon sujet")
    void jetonValide() {
        String token = jwtUtil.generateToken(ALICE);
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("alice");
        assertThat(jwtUtil.validateToken(token, ALICE)).isTrue();
    }

    @Test
    @DisplayName("Un jeton valide pour alice ne vaut pas pour bob")
    void mauvaisSujet() {
        String token = jwtUtil.generateToken(ALICE);
        assertThat(jwtUtil.validateToken(token, BOB)).isFalse();
    }

    @Test
    @DisplayName("Un jeton expire est rejete")
    void jetonExpire() {
        JwtUtil court = new JwtUtil(keyPair, -60_000);   // expire il y a une minute
        String token = court.generateToken(ALICE);
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
        assertThatThrownBy(() -> jwtUtil.extractUsername(token)).isInstanceOf(JwtException.class);
    }

    @Test
    @DisplayName("Un jeton signe par une autre cle privee est rejete")
    void autreCle() {
        JwtUtil autre = new JwtUtil(Keys.keyPairFor(SignatureAlgorithm.RS256), 60_000);
        String token = autre.generateToken(ALICE);
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
    }

    @Test
    @DisplayName("Un jeton dont l'audience n'est pas la notre est rejete")
    void mauvaiseAudience() {
        String token = Jwts.builder()
                .setSubject("alice")
                .setIssuer(JwtUtil.ISSUER)
                .setAudience("autre-service")
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
    }

    @Test
    @DisplayName("Un jeton dont l'emetteur n'est pas le notre est rejete")
    void mauvaisEmetteur() {
        String token = Jwts.builder()
                .setSubject("alice")
                .setIssuer("quelqu-un-d-autre")
                .setAudience(JwtUtil.AUDIENCE)
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
    }

    @Test
    @DisplayName("Attaque alg=none : un jeton non signe est rejete")
    void algorithmeNone() {
        String header = base64Url("{\"alg\":\"none\",\"typ\":\"JWT\"}");
        String payload = base64Url("{\"sub\":\"alice\",\"iss\":\"" + JwtUtil.ISSUER + "\",\"aud\":\"" + JwtUtil.AUDIENCE
                + "\",\"exp\":" + (System.currentTimeMillis() / 1000 + 60) + "}");
        String token = header + "." + payload + ".";
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
    }

    @Test
    @DisplayName("Confusion d'algorithme : un jeton HS256 signe avec la cle publique comme secret est rejete")
    void confusionAlgorithme() {
        // L'attaquant connait la cle publique (elle est publiee en JWKS) et tente de l'utiliser comme secret HMAC.
        byte[] publicKeyBytes = keyPair.getPublic().getEncoded();
        SecretKey faux = Keys.hmacShaKeyFor(java.util.Arrays.copyOf(publicKeyBytes, 64));
        String token = Jwts.builder()
                .setSubject("alice")
                .setIssuer(JwtUtil.ISSUER)
                .setAudience(JwtUtil.AUDIENCE)
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(faux, SignatureAlgorithm.HS256)
                .compact();
        assertThat(jwtUtil.validateToken(token, ALICE)).isFalse();
    }

    @Test
    @DisplayName("Un jeton altere apres signature est rejete")
    void jetonAltere() {
        String token = jwtUtil.generateToken(ALICE);
        String[] parts = token.split("\\.");
        String payloadModifie = base64Url(new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8)
                .replace("alice", "admin"));
        String altere = parts[0] + "." + payloadModifie + "." + parts[2];
        assertThat(jwtUtil.validateToken(altere, User.withUsername("admin").password("x").roles("ADMIN").build())).isFalse();
    }

    @Test
    @DisplayName("Chaine vide ou absurde : rejet sans exception")
    void chaineAbsurde() {
        assertThat(jwtUtil.validateToken("", ALICE)).isFalse();
        assertThat(jwtUtil.validateToken("pas.un.jeton", ALICE)).isFalse();
    }

    private static String base64Url(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }
}
