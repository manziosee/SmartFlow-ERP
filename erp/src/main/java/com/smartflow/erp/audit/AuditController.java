package com.smartflow.erp.audit;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "System-wide audit trail and activity monitoring.")
public class AuditController {

    private final AuditRepository auditRepository;

    @GetMapping
    @Operation(summary = "Get all audit logs")
    public List<AuditLog> getAuditLogs() {
        return auditRepository.findAll();
    }
}
