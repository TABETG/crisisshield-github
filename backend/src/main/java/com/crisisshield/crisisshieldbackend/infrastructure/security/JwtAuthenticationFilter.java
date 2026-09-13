package com.crisisshield.crisisshieldbackend.infrastructure.security;

import com.crisisshield.crisisshieldbackend.domain.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    // ✅ endpoints à ignorer par le JWT filter
    private static final List<String> SKIP_PATTERNS = List.of(
            "/api/auth/**",
            "/.well-known/**",
            "/actuator/**",
            "/error"
    );

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            @Qualifier("jwtUserDetailsService") UserDetailsService userDetailsService
    ) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        for (String p : SKIP_PATTERNS) {
            if (PATH_MATCHER.match(p, path)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            final String authHeader = request.getHeader("Authorization");

            // Pas de Bearer => on laisse passer
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = authHeader.substring(7).trim();
            if (jwt.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }

            String username = jwtUtil.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    String tenantId = null;

                    if (userDetails instanceof User u && u.getOrganisation() != null) {
                        tenantId = u.getOrganisation().getId();
                    }

                    TenantAuthentication authToken = new TenantAuthentication(
                            userDetails,
                            tenantId,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            // ✅ NE JAMAIS casser la requête : on log côté backend et on laisse passer
            // (sinon tu peux avoir “Empty reply from server” si ça part en exception non gérée)
            logger.warn("JWT filter error (path=" + request.getServletPath() + "): " + ex.getMessage(), ex);
            filterChain.doFilter(request, response);
        }
    }
}
