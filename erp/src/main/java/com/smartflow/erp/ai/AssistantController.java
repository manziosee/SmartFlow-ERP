package com.smartflow.erp.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final AIClient aiClient;

    @GetMapping("/insights")
    public ResponseEntity<List<Map<String, Object>>> getTopInsights(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.smartflow.erp.auth.User user,
            @RequestParam(defaultValue = "MANAGER") String role) {
        try {
            String userRole = (user != null) ? user.getRole().name() : role;
            List<Map<String, Object>> insights = aiClient.getInsights(userRole);
            if (insights == null || insights.isEmpty()) {
                return ResponseEntity.ok(getFallbackInsights());
            }
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            // AI service not available — return static fallback insights
            return ResponseEntity.ok(getFallbackInsights());
        }
    }

    private List<Map<String, Object>> getFallbackInsights() {
        return List.of(
            Map.of("type", "CASHFLOW", "priority", "HIGH",
                   "title", "Review Outstanding Invoices",
                   "description", "You have overdue invoices that may impact cash flow. Follow up with clients."),
            Map.of("type", "DEBT_RECOVERY", "priority", "MEDIUM",
                   "title", "Automate Payment Reminders",
                   "description", "Enable automatic reminders to reduce average payment delay and improve collections."),
            Map.of("type", "DEFAULT", "priority", "LOW",
                   "title", "Reconcile Last Month",
                   "description", "Ensure all transactions from last month are reconciled in the accounting module.")
        );
    }
}
