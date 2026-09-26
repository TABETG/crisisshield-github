-- V1 : schema initial de CrisisShield, reproduit a l'identique de ce qu'Hibernate generait en mode "update".
-- Regle : une migration appliquee ne se modifie JAMAIS. Toute evolution est une nouvelle migration V2, V3...
-- Hibernate est en mode "validate" : il verifie que ce schema correspond aux entites, et refuse de demarrer sinon.

create table organisation (
    id      varchar(255) not null,
    name    varchar(255) not null,
    constraint pk_organisation primary key (id),
    constraint uk_organisation_name unique (name)
);

create table app_user (
    id              varchar(255) not null,
    username        varchar(255) not null,
    email           varchar(255) not null,
    password        varchar(255) not null,
    enabled         boolean      not null,
    mfa_enabled     boolean      not null,
    mfa_secret      varchar(255),
    organisation_id varchar(255) not null,
    constraint pk_app_user primary key (id),
    constraint uk_app_user_username unique (username),
    constraint uk_app_user_email unique (email),
    constraint fk_app_user_organisation foreign key (organisation_id) references organisation (id)
);

create index ix_app_user_organisation on app_user (organisation_id);

create table user_roles (
    user_id varchar(255) not null,
    role    varchar(255),
    constraint fk_user_roles_user foreign key (user_id) references app_user (id),
    constraint ck_user_roles_role check (role in ('ROLE_ADMIN', 'ROLE_OPS', 'ROLE_AUDITOR'))
);

create index ix_user_roles_user on user_roles (user_id);

create table certificate_inventory (
    id              varchar(255) not null,
    subject         varchar(255) not null,
    issuer          varchar(255) not null,
    serial_number   varchar(255) not null,
    not_before      timestamp(6) with time zone not null,
    not_after       timestamp(6) with time zone not null,
    usage           varchar(255) not null,
    organisation_id varchar(255) not null,
    constraint pk_certificate_inventory primary key (id),
    constraint fk_certificate_inventory_organisation foreign key (organisation_id) references organisation (id)
);

create index ix_certificate_inventory_organisation on certificate_inventory (organisation_id);
