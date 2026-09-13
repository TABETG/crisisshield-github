package com.crisisshield.crisisshieldbackend.assistant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * EP18-US06 : seau a jetons par cle (utilisateur ou organisation).
 * Version 1 en memoire : correcte pour une seule instance. Des la deuxieme instance, l'etat doit
 * passer dans Redis (Bucket4j), sinon la limite est multipliee par le nombre d'instances.
 * C'est la raison pour laquelle le ticket mentionne Redis : ne pas l'oublier au passage sur Kubernetes.
 */
@Component
public class RateLimiter {

    private static final class Bucket {
        double tokens;
        long lastRefillNanos;
        Bucket(double tokens, long now) { this.tokens = tokens; this.lastRefillNanos = now; }
    }

    private final int capacity;
    private final double refillPerNano;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RateLimiter(@Value("${app.assistant.rate-limit.capacity:20}") int capacity,
                       @Value("${app.assistant.rate-limit.refill-per-minute:20}") double refillPerMinute) {
        this.capacity = capacity;
        this.refillPerNano = refillPerMinute / 60_000_000_000.0;
    }

    /** true si un jeton a pu etre consomme, false si la limite est atteinte. */
    public boolean tryAcquire(String key) {
        long now = System.nanoTime();
        Bucket b = buckets.computeIfAbsent(key, k -> new Bucket(capacity, now));
        synchronized (b) {
            double refilled = (now - b.lastRefillNanos) * refillPerNano;
            b.tokens = Math.min(capacity, b.tokens + refilled);
            b.lastRefillNanos = now;
            if (b.tokens >= 1.0) {
                b.tokens -= 1.0;
                return true;
            }
            return false;
        }
    }

    public int capacity() { return capacity; }
}
