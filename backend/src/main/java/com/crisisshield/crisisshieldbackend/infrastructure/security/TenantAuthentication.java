package com.crisisshield.crisisshieldbackend.infrastructure.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class TenantAuthentication extends AbstractAuthenticationToken {

    private final UserDetails principal;
    private final String tenantId;

    public TenantAuthentication(
            UserDetails principal,
            String tenantId,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(authorities);
        this.principal = principal;
        this.tenantId = tenantId;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null; // pas de credentials après JWT
    }

    @Override
    public UserDetails getPrincipal() {
        return principal;
    }

    public String getTenantId() {
        return tenantId;
    }
}
