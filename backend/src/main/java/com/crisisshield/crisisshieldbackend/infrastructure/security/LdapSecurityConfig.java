package com.crisisshield.crisisshieldbackend.infrastructure.security;

import com.crisisshield.crisisshieldbackend.infrastructure.tenant.TenantFilter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@Profile("ldap")
@EnableConfigurationProperties(LdapProps.class)
public class LdapSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final TenantFilter tenantFilter;
    private final CustomLdapUserDetailsContextMapper userDetailsContextMapper;

    public LdapSecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            TenantFilter tenantFilter,
            CustomLdapUserDetailsContextMapper userDetailsContextMapper
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.tenantFilter = tenantFilter;
        this.userDetailsContextMapper = userDetailsContextMapper;
    }

    @Bean
    public LdapContextSource contextSource(LdapProps p) {
        var cs = new LdapContextSource();
        cs.setUrl(p.url());
        cs.setBase(p.baseDn());

        if (p.managerDn() != null && !p.managerDn().isBlank()) {
            cs.setUserDn(p.managerDn());
            cs.setPassword(p.managerPassword());
        }

        cs.afterPropertiesSet();
        return cs;
    }

    @Bean
    public LdapAuthenticationProvider ldapAuthProvider(LdapContextSource cs, LdapProps p) {
        var authenticator = new BindAuthenticator(cs);

        // Option A : bind direct via patterns
        if (p.userDnPatterns() != null && !p.userDnPatterns().isEmpty()) {
            authenticator.setUserDnPatterns(p.userDnPatterns().toArray(String[]::new));
        } else {
            // Option B : recherche LDAP
            var userSearch = new FilterBasedLdapUserSearch(
                    p.userSearchBase(),
                    p.userSearchFilter(),
                    cs
            );
            authenticator.setUserSearch(userSearch);
        }

        var authorities = new DefaultLdapAuthoritiesPopulator(cs, p.groupSearchBase());
        authorities.setGroupSearchFilter(p.groupSearchFilter());

        var provider = new LdapAuthenticationProvider(authenticator, authorities);

        // map groupes -> rôles applicatifs
        provider.setAuthoritiesMapper(LdapGroupRoleMapper::map);

        // map LDAP user -> ton User JPA (via ton mapper)
        provider.setUserDetailsContextMapper(userDetailsContextMapper);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(LdapAuthenticationProvider ldapAuthenticationProvider) {
        return new ProviderManager(ldapAuthenticationProvider);
    }

    /**
     * Chaine 1 (prioritaire) : routes publiques, sans JwtAuthenticationFilter.
     * /api/auth/** est la route de connexion : joignable sans jeton par definition.
     * /error aussi, sinon Spring renvoie 403 et masque la vraie exception.
     */
    @Bean
    @Order(1)
    public SecurityFilterChain ldapPublicChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/auth/**", "/.well-known/**", "/error", "/actuator/health", "/actuator/info")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /**
     * Chaine 2 : tout le reste est protege par JWT puis filtre par organisation.
     * C'est la SEULE chaine sans securityMatcher de ce profil : en declarer une deuxieme
     * empeche Spring Security de demarrer.
     */
    @Bean
    @Order(2)
    public SecurityFilterChain apiProtectedChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(tenantFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}
