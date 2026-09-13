package com.crisisshield.crisisshieldbackend.infrastructure.security;

import com.crisisshield.crisisshieldbackend.infrastructure.tenant.TenantFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration de securite commune a tous les profils.
 */
@Configuration
public class CoreSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * JwtAuthenticationFilter et TenantFilter sont des @Component. Sans ces deux beans,
     * Spring Boot les enregistrerait aussi comme filtres de servlet, en plus de la chaine
     * Spring Security : chaque filtre tournerait deux fois par requete.
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public FilterRegistrationBean<TenantFilter> tenantFilterRegistration(TenantFilter filter) {
        FilterRegistrationBean<TenantFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}
