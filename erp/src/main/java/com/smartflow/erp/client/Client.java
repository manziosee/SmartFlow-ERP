package com.smartflow.erp.client;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;
    private String contactPerson;
    private String company;
    private String address;
    private String industry; // e.g. RETAIL, SERVICES

    // Financial Aggregates & AI ML scoring
    @Builder.Default
    private BigDecimal lifetimeRevenue = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalOutstandingAmount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalPaidAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RiskScore riskScore = RiskScore.LOW;

    @Builder.Default
    private Integer riskIndex = 0; // 0-100 scale

    @Builder.Default
    private Integer averagePaymentDelayDays = 0;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RiskScore {
        LOW, MEDIUM, HIGH
    }
}
