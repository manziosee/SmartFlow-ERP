package com.smartflow.erp.config;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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

    @Column(nullable = false, unique = true)
    private String region;

    @Column(nullable = false)
    private String taxType; // VAT, GST, Sales Tax

    @Column(nullable = false)
    private BigDecimal rate;

    @Builder.Default
    private Boolean active = true;
}
