package com.crisisshield.crisisshieldbackend.infrastructure.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;

public final class LdapGroupRoleMapper {
  // À adapter à tes groupes réels
  private static final Map<String, String> GROUP_TO_ROLE = Map.of(
      "admins", "ROLE_ORG_ADMIN",
      "crisis_managers", "ROLE_CRISIS_MANAGER",
      "auditors", "ROLE_AUDITOR",
      "users", "ROLE_ORG_USER"
  );

  public static Collection<? extends GrantedAuthority> map(Collection<? extends GrantedAuthority> ldapAuthorities) {
    Set<GrantedAuthority> out = new HashSet<>();
    for (GrantedAuthority a : ldapAuthorities) {
      // Spring LDAP renvoie souvent "ROLE_xxx" ou "CN=xxx" selon config.
      String raw = a.getAuthority();
      String normalized = normalize(raw); // ex: "admins"
      String role = GROUP_TO_ROLE.get(normalized);
      if (role != null) out.add(new SimpleGrantedAuthority(role));
    }
    // fallback minimal : un utilisateur LDAP a au moins ORG_USER
    if (out.isEmpty()) out.add(new SimpleGrantedAuthority("ROLE_ORG_USER"));
    return out;
  }

  private static String normalize(String s) {
    // "ROLE_ADMINS" -> "admins"
    String x = s.toLowerCase(Locale.ROOT).replace("role_", "");
    // "cn=admins,ou=groups,..." -> "admins"
    if (x.startsWith("cn=")) x = x.substring(3);
    int comma = x.indexOf(',');
    return comma > 0 ? x.substring(0, comma) : x;
  }

  private LdapGroupRoleMapper() {}
}
