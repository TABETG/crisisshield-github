package com.crisisshield.crisisshieldbackend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "app_user")
@Filter(name = "orgFilter", condition = "organisation_id = :orgId")
public class User implements UserDetails, TenantScopedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean mfaEnabled = false;

    @Column
    private String mfaSecret;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organisation_id", nullable = false)
    private Organisation organisation;

    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String id, String username, String email, String password, Set<Role> roles, Organisation organisation) {
        this(id, username, email, password, roles, false, null, organisation);
    }

    public User(String id, String username, String email, String password, Set<Role> roles, boolean mfaEnabled, String mfaSecret, Organisation organisation) {
        this.id = (id != null) ? id : UUID.randomUUID().toString();
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.mfaEnabled = mfaEnabled;
        this.mfaSecret = mfaSecret;
        this.organisation = organisation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public boolean isMfaEnabled() { return mfaEnabled; }
    public void setMfaEnabled(boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; }
    public String getMfaSecret() { return mfaSecret; }
    public void setMfaSecret(String mfaSecret) { this.mfaSecret = mfaSecret; }
    public Organisation getOrganisation() { return organisation; }
    public void setOrganisation(Organisation organisation) { this.organisation = organisation; }

    @Override
    public String getOrganisationId() {
        return organisation != null ? organisation.getId() : null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) { this.username = username; }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", roles=" + roles +
                ", enabled=" + enabled +
                ", mfaEnabled=" + mfaEnabled +
                ", organisation=" + (organisation != null ? organisation.getName() : "null") +
                '}';
    }
}
