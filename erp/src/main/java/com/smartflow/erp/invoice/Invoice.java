package com.smartflow.erp.invoice;

import com.smartflow.erp.client.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Client client;

    @Column(nullable = false)
    private BigDecimal amount;

    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Builder.Default
    private String currency = "RWF";

    private LocalDate issueDate;
    private LocalDate dueDate;

    // AI Predictions
    private LocalDate predictedPaymentDate;
    
    @Builder.Default
    private Double riskFactor = 0.0; // 0.0 (Safe) to 1.0 (High Risk)

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private java.util.List<InvoiceItem> items = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<com.smartflow.erp.payment.Payment> payments = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "invoice", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private com.smartflow.erp.recovery.RecoveryCase recoveryCase;

    // AI/Notification logic
    @Builder.Default
    private Integer reminderCount = 0;
    private LocalDateTime lastReminderSentAt;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        DRAFT, SENT, PENDING, PAID, OVERDUE, CANCELLED
    }
}
