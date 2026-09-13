package com.crisisshield.crisisshieldbackend.infrastructure.security;

import com.crisisshield.crisisshieldbackend.domain.UserRepository;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * EPIC_ID: EP02
 * EPIC_NAME: IAM & Multi-Tenant
 * US_ID: EP02-US05
 * US_TITLE: SSO LDAP/AD
 *
 * Ce mapper est crucial. Après que Spring Security a authentifié un utilisateur via LDAP,
 * cette classe est appelée pour "mapper" l'entrée LDAP à un objet UserDetails.
 *
 * Notre surcharge va plus loin :
 * 1. Elle récupère l'email de l'utilisateur depuis LDAP.
 * 2. Elle utilise cet email pour trouver l'utilisateur correspondant dans notre base de données (via UserRepository).
 * 3. Elle retourne l'objet User de notre domaine, qui contient l'organisation et les rôles de la base de données.
 *
 * Cela permet de lier un utilisateur externe (LDAP) à un tenant interne (Organisation).
 */
@Component
public class CustomLdapUserDetailsContextMapper extends LdapUserDetailsMapper {

    private final UserRepository userRepository;

    public CustomLdapUserDetailsContextMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
        // Récupère l'attribut 'mail' de l'entrée LDAP.
        String mail = ctx.getStringAttribute("mail");
        if (mail == null) {
            throw new UsernameNotFoundException("L'utilisateur LDAP " + username + " n'a pas d'attribut 'mail'.");
        }
        // Cherche l'utilisateur dans notre base de données par email.
        return userRepository.findByEmail(mail)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun utilisateur trouvé dans la base de données pour l'email LDAP : " + mail));
    }
}
