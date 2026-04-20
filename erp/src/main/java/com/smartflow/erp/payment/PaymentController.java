package com.smartflow.erp.payment;

import com.smartflow.erp.auth.User;
import com.smartflow.erp.invoice.Invoice;
import com.smartflow.erp.invoice.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    @GetMapping
    public ResponseEntity<List<Payment>> getPayments(@AuthenticationPrincipal User user) {
        if (user.getRole() == User.Role.CLIENT) {
            return ResponseEntity.ok(paymentRepository.findByInvoiceClientId(user.getClientId()));
        }
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Payment> recordPayment(@RequestBody Payment payment, @AuthenticationPrincipal User user) {
        // Enforce security: Accountants or Admins can record any.
        // Support role-based logic if needed.
        
        Invoice invoice = invoiceRepository.findById(payment.getInvoice().getId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // If Client is recording their own payment (e.g. from Stripe)
        if (user.getRole() == User.Role.CLIENT && !invoice.getClient().getId().equals(user.getClientId())) {
            return ResponseEntity.status(403).build();
        }

        payment.setInvoice(invoice);
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update invoice status if fully paid
        // (Simplified logic: for now just set to PAID)
        invoice.setStatus(Invoice.Status.PAID);
        invoiceRepository.save(invoice);
        
        return ResponseEntity.ok(savedPayment);
    }
}
