package com.smartflow.erp.invoice;

import com.smartflow.erp.notification.ToneAdaptiveNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final ToneAdaptiveNotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices(@org.springframework.security.core.annotation.AuthenticationPrincipal com.smartflow.erp.auth.User user) {
        if (user.getRole() == com.smartflow.erp.auth.User.Role.CLIENT) {
            return ResponseEntity.ok(invoiceRepository.findByClientId(user.getClientId()));
        }
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @PostMapping("/{id}/remind")
    public ResponseEntity<Void> sendReminder(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            notificationService.sendReminder(invoice);
            invoiceRepository.save(invoice);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        // Implement VAT calc (18% flat for Rwanda)
        if (invoice.getAmount() != null) {
            java.math.BigDecimal vat = invoice.getAmount().multiply(new java.math.BigDecimal("0.18"));
            invoice.setTaxAmount(vat);
        }
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }
}
