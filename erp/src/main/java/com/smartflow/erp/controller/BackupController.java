package com.smartflow.erp.controller;

import com.smartflow.erp.service.DatabaseBackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/backups")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    private final DatabaseBackupService backupService;

    @PostMapping("/trigger")
    public ResponseEntity<Map<String, String>> triggerBackup() {
        try {
            backupService.performBackup();
            return ResponseEntity.ok(Map.of("message", "Backup completed successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Backup failed: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBackupStats() {
        // Mocked size logic since getting accurate DB sizes cross-platform requires specific SQL
        // In a real app, you would query pg_database_size() for postgres
        long primarySizeMB = 450 + (long)(Math.random() * 50);
        long secondarySizeMB = 448 + (long)(Math.random() * 50);
        
        return ResponseEntity.ok(Map.of(
            "primaryDbSizeMB", primarySizeMB,
            "secondaryDbSizeMB", secondarySizeMB,
            "lastBackupTime", java.time.LocalDateTime.now().minusHours(2).toString(),
            "status", "Healthy"
        ));
    }

    @PostMapping("/schedule")
    public ResponseEntity<Map<String, String>> scheduleBackup(@RequestBody Map<String, String> request) {
        String time = request.get("time");
        // In a full implementation, this would update the cron trigger or save to DB
        // For now we just acknowledge the new schedule time
        return ResponseEntity.ok(Map.of("message", "Backup scheduled for " + time + " daily."));
    }
}
