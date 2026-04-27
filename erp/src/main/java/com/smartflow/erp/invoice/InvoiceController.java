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
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @RequestParam(required = false) String period,
            org.springframework.security.core.Authentication authentication) {
        List<Invoice> invoices;
        if (authentication != null && authentication.getPrincipal() instanceof com.smartflow.erp.auth.User) {
            com.smartflow.erp.auth.User user = (com.smartflow.erp.auth.User) authentication.getPrincipal();
            if (user.getRole() == com.smartflow.erp.auth.User.Role.CLIENT) {
                invoices = invoiceRepository.findByClientId(user.getClientId());
            } else {
                invoices = invoiceRepository.findAll();
            }
        } else {
            invoices = invoiceRepository.findAll();
        }

        if (period != null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            invoices = invoices.stream().filter(i -> {
                if (i.getIssueDate() == null) return false;
                switch (period) {
                    case "this-month": return i.getIssueDate().getMonth() == now.getMonth() && i.getIssueDate().getYear() == now.getYear();
                    case "last-month": return i.getIssueDate().isAfter(now.minusMonths(1).withDayOfMonth(1).minusDays(1)) && i.getIssueDate().isBefore(now.withDayOfMonth(1));
                    case "this-quarter": return i.getIssueDate().isAfter(now.minusMonths(3));
                    case "this-year": return i.getIssueDate().getYear() == now.getYear();
                    default: return true;
                }
            }).toList();
        }
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        return invoiceRepository.findById(id).map(invoice -> {
            if (authentication != null && authentication.getPrincipal() instanceof com.smartflow.erp.auth.User) {
                com.smartflow.erp.auth.User user = (com.smartflow.erp.auth.User) authentication.getPrincipal();
                if (user.getRole() == com.smartflow.erp.auth.User.Role.CLIENT && 
                    (invoice.getClient() == null || !invoice.getClient().getId().equals(user.getClientId()))) {
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
                
                // CRITICAL: Set unique invoice number to avoid 400/500 on save
                inv.setInvoiceNumber("INV-GEN-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                
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
        // Ensure unique invoice number if not provided or to avoid collisions
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            // Check for duplicates
            if (invoiceRepository.findByInvoiceNumber(invoice.getInvoiceNumber()).isPresent()) {
                invoice.setInvoiceNumber(invoice.getInvoiceNumber() + "-" + java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase());
            }
        }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoiceRepository.delete(invoice);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Invoice> cancelInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(Invoice.Status.CANCELLED);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice details) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setAmount(details.getAmount());
            invoice.setStatus(details.getStatus());
            invoice.setDueDate(details.getDueDate());
            // Update items if provided
            if (details.getItems() != null) {
                invoice.setItems(details.getItems());
            }
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }
}
