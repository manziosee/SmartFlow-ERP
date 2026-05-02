package com.smartflow.erp.audit;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * B7: Audit log entity — records sensitive create/delete actions across the system.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;       // e.g. "CREATE_INVOICE", "DELETE_CLIENT"

    @Column(nullable = false)
    private String entityType;   // e.g. "Invoice", "Client"

    private Long entityId;

    @Column(nullable = false)
    private String performedBy;  // user email

    @Column(columnDefinition = "TEXT")
    private String details;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
