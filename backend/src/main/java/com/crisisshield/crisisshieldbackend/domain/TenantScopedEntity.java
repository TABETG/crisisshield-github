package com.crisisshield.crisisshieldbackend.domain;

import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@FilterDef(name = "orgFilter", parameters = @ParamDef(name = "orgId", type = String.class))
public interface TenantScopedEntity {
  String getOrganisationId();
}
