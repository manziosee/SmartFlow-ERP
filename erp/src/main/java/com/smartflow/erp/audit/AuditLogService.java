package com.smartflow.erp.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * B7: Service for writing audit log entries.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Records an auditable event.
     *
     * @param action      e.g. "CREATE_INVOICE", "DELETE_CLIENT"
     * @param entityType  e.g. "Invoice", "Client"
     * @param entityId    DB primary key of the affected entity (may be null)
     * @param performedBy email of the authenticated user
     * @param details     free-text description
     */
    public void log(String action, String entityType, Long entityId,
                    String performedBy, String details) {
        try {
            AuditLog entry = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .performedBy(performedBy != null ? performedBy : "system")
                    .details(details)
                    .timestamp(LocalDateTime.now())
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception ex) {
            // Audit failure must never crash business logic
            log.error("Failed to write audit log [{} {} id={}]: {}", action, entityType, entityId, ex.getMessage());
        }
    }
}
