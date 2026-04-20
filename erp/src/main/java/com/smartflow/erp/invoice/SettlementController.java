package com.smartflow.erp.invoice;

import com.smartflow.erp.ai.AIClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final AIClient aiClient;
    private final InvoiceRepository invoiceRepository;

    /**
     * Smart Settlement Endpoint:
     * 1. Receives payment amount and client ID.
     * 2. Fetches outstanding invoices for the client from Java (DB).
     * 3. Sends data to Clojure (Rules Engine).
     * 4. Clojure calls Python (AI) to get risk assessment.
     * 5. Returns a strategy and allocation plan.
     */
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateSmartSettlement(
            @RequestParam Long clientId,
            @RequestParam double amount) {

        List<Invoice> invoices = invoiceRepository.findByClientIdAndStatus(clientId, Invoice.Status.PENDING);
        
        // Prepare simplified data for Clojure
        List<Map<String, Object>> invoiceData = new ArrayList<>();
        for (Invoice inv : invoices) {
            invoiceData.add(Map.of(
                "id", inv.getId(),
                "amount", inv.getAmount(),
                "dueDate", inv.getDueDate().toString()
            ));
        }

        // Call Clojure Rules Engine
        Map<String, Object> strategy = aiClient.getAllocationStrategy(amount, invoiceData);

        return ResponseEntity.ok(strategy);
    }
}
