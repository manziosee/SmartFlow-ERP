package com.smartflow.erp.tax;

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
@Table(name = "tax_rules")
public class TaxRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String taxType;

    @Column(nullable = false)
    private BigDecimal rate;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
