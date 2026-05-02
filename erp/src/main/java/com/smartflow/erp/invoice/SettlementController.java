package com.smartflow.erp.invoice;

import com.smartflow.erp.ai.AIClient;
import com.smartflow.erp.service.EmailService;
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
    private final EmailService emailService;

    /**
     * Smart Settlement Endpoint:
     * 1. Receives payment amount and client ID.
     * 2. Fetches outstanding invoices for the client from Java (DB).
     * 3. Sends data to Clojure (Rules Engine).
     * 4. Clojure calls Python (AI) to get risk assessment.
     * 5. Returns a strategy and allocation plan.
     * B17: Sends payment-received email notification to the client.
     */
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateSmartSettlement(
            @RequestParam Long clientId,
            @RequestParam double amount) {

        List<Invoice> invoices = invoiceRepository.findByClientIdAndStatus(clientId, Invoice.Status.PENDING);

        List<Map<String, Object>> invoiceData = new ArrayList<>();
        for (Invoice inv : invoices) {
            invoiceData.add(Map.of(
                    "id", inv.getId(),
                    "amount", inv.getAmount(),
                    "dueDate", inv.getDueDate().toString()
            ));
        }

        Map<String, Object> strategy = aiClient.getAllocationStrategy(amount, invoiceData);

        // B17: Notify client of payment received (best-effort — uses first matching invoice for client details)
        invoices.stream()
                .filter(inv -> inv.getClient() != null
                        && inv.getClient().getEmail() != null
                        && !inv.getClient().getEmail().isBlank())
                .findFirst()
                .ifPresent(inv -> emailService.sendPaymentReceivedNotification(
                        inv.getClient().getEmail(),
                        inv.getClient().getName(),
                        "multiple invoices",
                        String.valueOf(amount),
                        inv.getCurrency() != null ? inv.getCurrency() : "RWF"
                ));

        return ResponseEntity.ok(strategy);
    }
}
