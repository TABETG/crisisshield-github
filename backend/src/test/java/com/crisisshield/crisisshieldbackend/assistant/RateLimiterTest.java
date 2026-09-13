package com.crisisshield.crisisshieldbackend.assistant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimiterTest {

    @Test
    @DisplayName("La capacite est respectee : la requete de trop est refusee")
    void capacite() {
        RateLimiter limiter = new RateLimiter(5, 0.0);   // aucun rechargement pendant le test
        for (int i = 0; i < 5; i++) {
            assertThat(limiter.tryAcquire("alice")).as("requete %d", i + 1).isTrue();
        }
        assertThat(limiter.tryAcquire("alice")).isFalse();
    }

    @Test
    @DisplayName("Les cles sont independantes : bob n'est pas penalise par alice")
    void clesIndependantes() {
        RateLimiter limiter = new RateLimiter(1, 0.0);
        assertThat(limiter.tryAcquire("alice")).isTrue();
        assertThat(limiter.tryAcquire("alice")).isFalse();
        assertThat(limiter.tryAcquire("bob")).isTrue();
    }

    @Test
    @DisplayName("Le seau se recharge avec le temps")
    void rechargement() throws InterruptedException {
        RateLimiter limiter = new RateLimiter(1, 6_000.0);   // 100 jetons par seconde
        assertThat(limiter.tryAcquire("alice")).isTrue();
        assertThat(limiter.tryAcquire("alice")).isFalse();
        Thread.sleep(50);
        assertThat(limiter.tryAcquire("alice")).isTrue();
    }
}
