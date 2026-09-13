package com.crisisshield.crisisshieldbackend.assistant;

import com.crisisshield.crisisshieldbackend.assistant.dto.AssistantRequest;
import com.crisisshield.crisisshieldbackend.assistant.dto.AssistantResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * EP18 : seul point d'entree HTTP vers l'assistant. Protege par la chaine de securite (JWT obligatoire).
 */
@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AssistantResponse> ask(@Valid @RequestBody AssistantRequest request) {
        AssistantResponse response = assistantService.ask(request.question());
        return switch (response.code()) {
            case "OK" -> ResponseEntity.ok(response);
            case "RATE_LIMITED" -> ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", "60").body(response);
            default -> ResponseEntity.unprocessableEntity().body(response);
        };
    }
}
