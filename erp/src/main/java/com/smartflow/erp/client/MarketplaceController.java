package com.smartflow.erp.client;

import com.smartflow.erp.ai.AIClient;
import com.smartflow.erp.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final AIClient aiClient;
    private final ClientRepository clientRepository;

    /**
     * Role-Based Marketplace Recommendations.
     * Delegates logic to the Clojure Rules Engine to fetch dynamic partner offers.
     */
    @GetMapping("/offers")
    public ResponseEntity<List<Map<String, Object>>> getMarketplaceOffers(@AuthenticationPrincipal User user) {
        // Enforce role check: Only CLIENTs see marketplace recommendations
        if (user.getRole() != User.Role.CLIENT || user.getClientId() == null) {
            return ResponseEntity.status(403).build();
        }

        return clientRepository.findById(user.getClientId()).map(client -> {
            // Build profile map for Clojure
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", client.getId());
            profile.put("name", client.getName());
            profile.put("industry", client.getIndustry() != null ? client.getIndustry() : "GENERAL");
            profile.put("revenue", client.getLifetimeRevenue());

            // Call Clojure Rules Engine for dynamic recommendations
            List<Map<String, Object>> recommendations = aiClient.getMarketplaceRecommendations(profile);
            return ResponseEntity.ok(recommendations);
        }).orElse(ResponseEntity.notFound().build());
    }
}
