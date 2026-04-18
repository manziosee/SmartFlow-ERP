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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
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

    // AI/Notification logic
    @Builder.Default
    private Integer reminderCount = 0;
    private LocalDateTime lastReminderSentAt;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, PAID, OVERDUE
    }
}
