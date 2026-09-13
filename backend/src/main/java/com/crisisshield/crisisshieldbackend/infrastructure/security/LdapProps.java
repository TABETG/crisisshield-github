package com.crisisshield.crisisshieldbackend.infrastructure.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.util.List;

@ConfigurationProperties(prefix = "app.ldap")
public record LdapProps(
    String url,
    String baseDn,
    List<String> userDnPatterns,
    String managerDn,
    String managerPassword,
    String userSearchBase,
    String userSearchFilter,
    String groupSearchBase,
    String groupSearchFilter
) {}
