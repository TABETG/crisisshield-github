package com.crisisshield.crisisshieldbackend.infrastructure.tenant;

import com.crisisshield.crisisshieldbackend.infrastructure.security.TenantAuthentication;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class TenantFilter extends OncePerRequestFilter {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  protected void doFilterInternal(
          HttpServletRequest request,
          HttpServletResponse response,
          FilterChain chain
  ) throws ServletException, IOException {

    Session session = entityManager.unwrap(Session.class);

    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();

      // Cas normal : JwtAuthenticationFilter a déjà mis un TenantAuthentication
      if (auth instanceof TenantAuthentication tenantAuth && tenantAuth.isAuthenticated()) {
        String orgId = tenantAuth.getTenantId();

        if (orgId != null && !orgId.isBlank()) {
          Filter filter = session.enableFilter("orgFilter");
          filter.setParameter("orgId", orgId); // correspond à @ParamDef(name="orgId")
        }
      }

      chain.doFilter(request, response);

    } finally {
      // Important : évite les fuites entre requêtes (thread pool)
      if (session.getEnabledFilter("orgFilter") != null) {
        session.disableFilter("orgFilter");
      }
    }
  }
}
