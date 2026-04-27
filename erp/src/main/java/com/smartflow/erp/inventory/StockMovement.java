package com.smartflow.erp.inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity; // Positive for inflow, negative for outflow

    @Enumerated(EnumType.STRING)
    private MovementType type;

    private String reference; // Invoice number, Purchase Order, etc.

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum MovementType {
        INFLOW, OUTFLOW, ADJUSTMENT, RETURN
    }
}
