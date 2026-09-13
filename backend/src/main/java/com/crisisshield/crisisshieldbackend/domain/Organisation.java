package com.crisisshield.crisisshieldbackend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "organisation")
@Filter(name = "orgFilter", condition = "id = :orgId")
public class Organisation implements TenantScopedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    public Organisation() {
        this.id = UUID.randomUUID().toString();
    }

    public Organisation(String name) {
        this();
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getOrganisationId() {
        return this.id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Organisation that = (Organisation) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Organisation{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
