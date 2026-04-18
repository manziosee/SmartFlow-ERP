package com.smartflow.erp.recovery;

import com.smartflow.erp.invoice.Invoice;
import com.smartflow.erp.auth.User;
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
@Table(name = "recovery_cases")
public class RecoveryCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RecoveryStatus status = RecoveryStatus.PENDING;

    private Integer riskScore;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum RecoveryStatus {
        PENDING, CONTACTED, PROMISED_PAYMENT, FAILED_RECOVERY, RESOLVED
    }
}
