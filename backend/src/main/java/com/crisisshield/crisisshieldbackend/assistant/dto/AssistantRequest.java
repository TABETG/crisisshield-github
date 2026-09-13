package com.crisisshield.crisisshieldbackend.assistant.dto;

import jakarta.validation.constraints.NotBlank;

public record AssistantRequest(@NotBlank String question) {}
