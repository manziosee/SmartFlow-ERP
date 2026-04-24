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

    private final com.smartflow.erp.client.ClientRepository clientRepository;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices(org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof com.smartflow.erp.auth.User) {
            com.smartflow.erp.auth.User user = (com.smartflow.erp.auth.User) authentication.getPrincipal();
            if (user.getRole() == com.smartflow.erp.auth.User.Role.CLIENT) {
                return ResponseEntity.ok(invoiceRepository.findByClientId(user.getClientId()));
            }
        }
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        return invoiceRepository.findById(id).map(invoice -> {
            if (authentication != null && authentication.getPrincipal() instanceof com.smartflow.erp.auth.User) {
                com.smartflow.erp.auth.User user = (com.smartflow.erp.auth.User) authentication.getPrincipal();
                if (user.getRole() == com.smartflow.erp.auth.User.Role.CLIENT && !id.equals(user.getClientId())) {
                    return ResponseEntity.status(403).<Invoice>build();
                }
            }
            return ResponseEntity.ok(invoice);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/remind")
    public ResponseEntity<Void> sendReminder(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            notificationService.sendReminder(invoice);
            invoiceRepository.save(invoice);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Invoice> sendInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(Invoice.Status.SENT);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Invoice>> generateRecurringInvoices(@RequestBody(required = false) List<Long> clientIds) {
        List<com.smartflow.erp.client.Client> clients;
        if (clientIds == null || clientIds.isEmpty()) {
            clients = clientRepository.findAll();
        } else {
            clients = clientRepository.findAllById(clientIds);
        }
        
        List<Invoice> generated = new java.util.ArrayList<>();
        
        for (com.smartflow.erp.client.Client client : clients) {
            // Only generate if a rate is set
            if (client.getMonthlyRate() != null && client.getMonthlyRate().compareTo(java.math.BigDecimal.ZERO) > 0) {
                Invoice inv = new Invoice();
                inv.setClient(client);
                inv.setAmount(client.getMonthlyRate());
                inv.setStatus(Invoice.Status.DRAFT);
                inv.setIssueDate(java.time.LocalDate.now());
                inv.setDueDate(java.time.LocalDate.now().plusDays(30));
                
                java.math.BigDecimal vat = inv.getAmount().multiply(new java.math.BigDecimal("0.18"));
                inv.setTaxAmount(vat);
                
                generated.add(invoiceRepository.save(inv));
            }
        }
        return ResponseEntity.ok(generated);
    }

    private final com.smartflow.erp.inventory.ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        // Implement VAT calc (18% flat for Rwanda)
        if (invoice.getAmount() != null) {
            java.math.BigDecimal vat = invoice.getAmount().multiply(new java.math.BigDecimal("0.18"));
            invoice.setTaxAmount(vat);
        }

        // Link items to invoice and reduce stock
        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                item.setInvoice(invoice);
                if (item.getProduct() != null && item.getProduct().getId() != null) {
                    productRepository.findById(item.getProduct().getId()).ifPresent(product -> {
                        product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                        productRepository.save(product);
                    });
                }
            }
        }
        
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }
}
