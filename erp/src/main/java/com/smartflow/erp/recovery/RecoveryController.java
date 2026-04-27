package com.smartflow.erp.recovery;

import com.smartflow.erp.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recovery")
@RequiredArgsConstructor
public class RecoveryController {

    private final RecoveryCaseRepository recoveryCaseRepository;
    private final RecoveryService recoveryService;

    @GetMapping
    public ResponseEntity<List<RecoveryCase>> getCases(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        // Recovery Agents only see their assigned cases
        if (user.getRole() == User.Role.RECOVERY_AGENT) {
            return ResponseEntity.ok(recoveryCaseRepository.findByAssignedAgentId(user.getId()));
        }
        // Managers and Admins see all
        return ResponseEntity.ok(recoveryCaseRepository.findAll());
    }

    @PostMapping("/{invoiceId}/initiate")
    public ResponseEntity<RecoveryCase> initiateRecovery(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(recoveryService.createCase(invoiceId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RecoveryCase> updateStatus(
            @PathVariable Long id, 
            @RequestParam RecoveryCase.RecoveryStatus status,
            @AuthenticationPrincipal User user) {
        
        return recoveryCaseRepository.findById(id).map(recoveryCase -> {
            // Basic security: Agents can only update their own cases
            if (user.getRole() == User.Role.RECOVERY_AGENT && 
                (recoveryCase.getAssignedAgent() == null || !recoveryCase.getAssignedAgent().getId().equals(user.getId()))) {
                return ResponseEntity.status(403).<RecoveryCase>build();
            }
            
            recoveryCase.setStatus(status);
            return ResponseEntity.ok(recoveryCaseRepository.save(recoveryCase));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<RecoveryCase> addNote(@PathVariable Long id, @RequestBody String note) {
        // Implementation for adding notes to a case
        return recoveryCaseRepository.findById(id).map(recoveryCase -> {
            // Logic for notes (could be a separate entity)
            return ResponseEntity.ok(recoveryCase);
        }).orElse(ResponseEntity.notFound().build());
    }
}
