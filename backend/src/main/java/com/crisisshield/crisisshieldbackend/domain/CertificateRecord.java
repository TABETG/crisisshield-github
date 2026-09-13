package com.crisisshield.crisisshieldbackend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;

import java.time.Instant;

/**
 * EP09-US03 : inventaire des certificats utilises par CrisisShield, par organisation.
 * Alimente par EP09-US04 (alertes d'expiration) et EP09-US11 (inventaire cryptographique).
 */
@Entity
@Table(name = "certificate_inventory")
@Filter(name = "orgFilter", condition = "organisation_id = :orgId")
public class CertificateRecord implements TenantScopedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String issuer;

    @Column(nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private Instant notBefore;

    @Column(nullable = false)
    private Instant notAfter;

    /** Ex. : TLS_SERVER, TLS_CLIENT, SIGNATURE, SEAL */
    @Column(nullable = false)
    private String usage;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organisation_id", nullable = false)
    private Organisation organisation;

    protected CertificateRecord() {}

    public CertificateRecord(String subject, String issuer, String serialNumber,
                             Instant notBefore, Instant notAfter, String usage, Organisation organisation) {
        this.subject = subject;
        this.issuer = issuer;
        this.serialNumber = serialNumber;
        this.notBefore = notBefore;
        this.notAfter = notAfter;
        this.usage = usage;
        this.organisation = organisation;
    }

    public String getId() { return id; }
    public String getSubject() { return subject; }
    public String getIssuer() { return issuer; }
    public String getSerialNumber() { return serialNumber; }
    public Instant getNotBefore() { return notBefore; }
    public Instant getNotAfter() { return notAfter; }
    public String getUsage() { return usage; }
    public Organisation getOrganisation() { return organisation; }

    @Override
    public String getOrganisationId() {
        return organisation != null ? organisation.getId() : null;
    }

    public boolean expiresWithin(java.time.Duration duration) {
        return notAfter.isBefore(Instant.now().plus(duration));
    }
}
