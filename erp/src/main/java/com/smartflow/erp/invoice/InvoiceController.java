package com.smartflow.erp.invoice;

import com.smartflow.erp.audit.AuditLogService;
import com.smartflow.erp.auth.User;
import com.smartflow.erp.auth.UserRepository;
import com.smartflow.erp.notification.Notification;
import com.smartflow.erp.notification.NotificationRepository;
import com.smartflow.erp.notification.ToneAdaptiveNotificationService;
import com.smartflow.erp.service.EmailService;
import com.smartflow.erp.tax.TaxService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final ToneAdaptiveNotificationService notificationService;
    private final com.smartflow.erp.client.ClientRepository clientRepository;
    private final com.smartflow.erp.inventory.ProductRepository productRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;
    private final TaxService taxService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ---------------------------------------------------------------- GET all (with optional pagination + sorting)
    @GetMapping
    public ResponseEntity<?> getAllInvoices(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {

        List<Invoice> invoices;
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            if (user.getRole() == User.Role.CLIENT) {
                invoices = invoiceRepository.findByClientId(user.getClientId());
            } else {
                invoices = q != null && !q.isBlank()
                        ? invoiceRepository.searchInvoices(q)
                        : invoiceRepository.findAll();
            }
        } else {
            invoices = q != null && !q.isBlank()
                    ? invoiceRepository.searchInvoices(q)
                    : invoiceRepository.findAll();
        }

        // Filter by status
        if (status != null && !status.isBlank()) {
            try {
                Invoice.Status statusEnum = Invoice.Status.valueOf(status.toUpperCase());
                invoices = invoices.stream().filter(i -> i.getStatus() == statusEnum).toList();
            } catch (IllegalArgumentException ignored) {
            }
        }

        // Filter by period
        if (period != null) {
            LocalDate now = LocalDate.now();
            invoices = invoices.stream().filter(i -> {
                if (i.getIssueDate() == null) return false;
                return switch (period) {
                    case "this-month" -> i.getIssueDate().getMonth() == now.getMonth()
                            && i.getIssueDate().getYear() == now.getYear();
                    case "last-month" -> i.getIssueDate().isAfter(now.minusMonths(1).withDayOfMonth(1).minusDays(1))
                            && i.getIssueDate().isBefore(now.withDayOfMonth(1));
                    case "this-quarter" -> i.getIssueDate().isAfter(now.minusMonths(3));
                    case "this-year" -> i.getIssueDate().getYear() == now.getYear();
                    default -> true;
                };
            }).toList();
        }

        // Sort
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        invoices = invoices.stream().sorted((a, b) -> {
            try {
                if ("dueDate".equals(sortBy)) {
                    if (a.getDueDate() == null) return 1;
                    if (b.getDueDate() == null) return -1;
                    return direction == Sort.Direction.ASC
                            ? a.getDueDate().compareTo(b.getDueDate())
                            : b.getDueDate().compareTo(a.getDueDate());
                }
                if ("amount".equals(sortBy)) {
                    if (a.getAmount() == null) return 1;
                    if (b.getAmount() == null) return -1;
                    return direction == Sort.Direction.ASC
                            ? a.getAmount().compareTo(b.getAmount())
                            : b.getAmount().compareTo(a.getAmount());
                }
                // default: createdAt
                if (a.getCreatedAt() == null) return 1;
                if (b.getCreatedAt() == null) return -1;
                return direction == Sort.Direction.ASC
                        ? a.getCreatedAt().compareTo(b.getCreatedAt())
                        : b.getCreatedAt().compareTo(a.getCreatedAt());
            } catch (Exception ex) {
                return 0;
            }
        }).toList();

        // Paginate if requested
        if (page != null && size != null && size > 0) {
            int start = page * size;
            int end = Math.min(start + size, invoices.size());
            List<Invoice> pageContent = start >= invoices.size() ? List.of() : invoices.subList(start, end);
            Page<Invoice> pageResult = new PageImpl<>(pageContent, PageRequest.of(page, size), invoices.size());
            return ResponseEntity.ok(pageResult);
        }

        return ResponseEntity.ok(invoices);
    }

    // ---------------------------------------------------------------- GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id, Authentication authentication) {
        return invoiceRepository.findById(id).map(invoice -> {
            if (authentication != null && authentication.getPrincipal() instanceof User user) {
                if (user.getRole() == User.Role.CLIENT
                        && (invoice.getClient() == null || !invoice.getClient().getId().equals(user.getClientId()))) {
                    return ResponseEntity.status(403).<Invoice>build();
                }
            }
            return ResponseEntity.ok(invoice);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST remind
    @PostMapping("/{id}/remind")
    public ResponseEntity<Void> sendReminder(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            notificationService.sendReminder(invoice);
            invoiceRepository.save(invoice);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST send
    @PostMapping("/{id}/send")
    public ResponseEntity<Invoice> sendInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(Invoice.Status.SENT);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST generate recurring
    @PostMapping("/generate")
    public ResponseEntity<List<Invoice>> generateRecurringInvoices(
            @RequestBody(required = false) List<Long> clientIds) {

        List<com.smartflow.erp.client.Client> clients = (clientIds == null || clientIds.isEmpty())
                ? clientRepository.findAll()
                : clientRepository.findAllById(clientIds);

        List<Invoice> generated = new java.util.ArrayList<>();
        for (com.smartflow.erp.client.Client client : clients) {
            if (client.getMonthlyRate() != null
                    && client.getMonthlyRate().compareTo(java.math.BigDecimal.ZERO) > 0) {
                Invoice inv = new Invoice();
                inv.setClient(client);
                inv.setAmount(client.getMonthlyRate());
                inv.setStatus(Invoice.Status.DRAFT);
                inv.setIssueDate(LocalDate.now());
                inv.setDueDate(LocalDate.now().plusDays(30));
                inv.setInvoiceNumber("INV-GEN-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                inv.setTaxAmount(taxService.calculateTax(inv.getAmount(), "VAT_18"));
                generated.add(invoiceRepository.save(inv));
            }
        }
        return ResponseEntity.ok(generated);
    }

    // ---------------------------------------------------------------- sequential invoice number
    private synchronized String generateSequentialInvoiceNumber() {
        long nextId = invoiceRepository.findMaxId().orElse(0L) + 1;
        return String.format("INV-%04d", nextId);
    }

    // ---------------------------------------------------------------- POST create (B7 audit, B17 email, B19 tax, B21 stock alert)
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody Invoice invoice, Principal principal) {
        // Sequential invoice number
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateSequentialInvoiceNumber());
        } else if (invoiceRepository.findByInvoiceNumber(invoice.getInvoiceNumber()).isPresent()) {
            invoice.setInvoiceNumber(generateSequentialInvoiceNumber());
        }

        // B19: Use TaxService instead of inline calc
        if (invoice.getAmount() != null) {
            invoice.setTaxAmount(taxService.calculateTax(invoice.getAmount(), "VAT_18"));
        }

        // Link items to invoice, reduce stock, and check stock alerts (B21)
        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                item.setInvoice(invoice);
                if (item.getProduct() != null && item.getProduct().getId() != null) {
                    productRepository.findById(item.getProduct().getId()).ifPresent(product -> {
                        int newQty = product.getStockQuantity() - item.getQuantity();
                        product.setStockQuantity(newQty);
                        productRepository.save(product);

                        // B21: Stock level alert
                        if (newQty <= product.getMinStockLevel()) {
                            sendStockLowNotification(product, newQty);
                        }
                    });
                }
            }
        }

        Invoice saved = invoiceRepository.save(invoice);

        // B7: Audit log
        String performedBy = principal != null ? principal.getName() : "system";
        auditLogService.log("CREATE_INVOICE", "Invoice", saved.getId(), performedBy,
                "Created invoice " + saved.getInvoiceNumber()
                        + " for client " + (saved.getClient() != null ? saved.getClient().getName() : "unknown"));

        // B17: Email notification to client
        emailService.sendInvoiceCreatedNotification(saved);

        return ResponseEntity.ok(saved);
    }

    // ---------------------------------------------------------------- DELETE (B7 audit)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id, Principal principal) {
        return invoiceRepository.findById(id).map(invoice -> {
            String performedBy = principal != null ? principal.getName() : "system";
            auditLogService.log("DELETE_INVOICE", "Invoice", invoice.getId(), performedBy,
                    "Deleted invoice " + invoice.getInvoiceNumber());
            invoiceRepository.delete(invoice);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST cancel
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Invoice> cancelInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(Invoice.Status.CANCELLED);
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice details) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setAmount(details.getAmount());
            invoice.setStatus(details.getStatus());
            invoice.setDueDate(details.getDueDate());
            if (details.getItems() != null) {
                invoice.setItems(details.getItems());
            }
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- B21: stock alert helper
    private void sendStockLowNotification(com.smartflow.erp.inventory.Product product, int currentQty) {
        List<User> adminManagers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN || u.getRole() == User.Role.MANAGER)
                .toList();

        for (User recipient : adminManagers) {
            Notification notification = Notification.builder()
                    .title("Low Stock Alert: " + product.getName())
                    .message("Product '" + product.getName() + "' (SKU: " + product.getSku()
                            + ") has fallen to " + currentQty + " units, at or below the minimum stock level of "
                            + product.getMinStockLevel() + ".")
                    .recipient(recipient)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
