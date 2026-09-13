package com.crisisshield.crisisshieldbackend.api.dto;

// Note: The 'mfaCode' field is added to support MFA during login.
public record LoginRequest(String username, String password, String mfaCode) {}
