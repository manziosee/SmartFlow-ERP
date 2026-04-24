package com.smartflow.erp.vendor;

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
@Table(name = "vendors")
public class Vendor {

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
    private String category; // e.g. RAW_MATERIALS, SERVICES, UTILITIES

    @Builder.Default
    private BigDecimal totalPurchasedAmount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Builder.Default
    private Integer reliabilityScore = 100; // 0-100 based on delivery time

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
