package com.smartflow.erp.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AIClient aiClient;

    @GetMapping("/insights")
    public ResponseEntity<List<Map<String, Object>>> getTopInsights() {
        try {
            return ResponseEntity.ok(aiClient.getInsights());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
