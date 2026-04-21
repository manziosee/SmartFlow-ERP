package com.smartflow.erp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DatabaseBackupService {

    private final JdbcTemplate primaryJdbcTemplate;
    private final JdbcTemplate secondaryJdbcTemplate;

    public DatabaseBackupService(
            JdbcTemplate primaryJdbcTemplate,
            @Qualifier("secondaryJdbcTemplate") JdbcTemplate secondaryJdbcTemplate) {
        this.primaryJdbcTemplate = primaryJdbcTemplate;
        this.secondaryJdbcTemplate = secondaryJdbcTemplate;
    }

    /**
     * Backup task that runs every 24 hours at 2 AM.
     * Synchronizes core tables from Neon (Primary) to Turso (Backup).
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void performBackup() {
        log.info("Starting scheduled database backup from Primary (Neon) to Secondary (Turso)...");
        
        try {
            syncTable("users");
            syncTable("clients");
            syncTable("invoices");
            syncTable("payments");
            log.info("Database backup completed successfully.");
        } catch (Exception e) {
            log.error("Failed to complete database backup: {}", e.getMessage(), e);
        }
    }

    private void syncTable(String tableName) {
        log.debug("Syncing table: {}", tableName);
        
        // Fetch all data from primary
        List<Map<String, Object>> rows = primaryJdbcTemplate.queryForList("SELECT * FROM " + tableName);
        
        if (rows.isEmpty()) {
            log.debug("No data found in primary table: {}. Skipping sync.", tableName);
            return;
        }

        // 1. Create table on secondary if not exists (Simplified schema)
        // In a real production scenario, you would use a more robust schema migration tool
        // secondaryJdbcTemplate.execute("CREATE TABLE IF NOT EXISTS ...");

        // 2. Clear secondary table
        secondaryJdbcTemplate.execute("DELETE FROM " + tableName);

        // 3. Insert rows into secondary
        for (Map<String, Object> row : rows) {
            StringBuilder columns = new StringBuilder();
            StringBuilder values = new StringBuilder();
            Object[] args = new Object[row.size()];
            int i = 0;

            for (Map.Entry<String, Object> entry : row.entrySet()) {
                if (i > 0) {
                    columns.append(", ");
                    values.append(", ");
                }
                columns.append(entry.getKey());
                values.append("?");
                args[i++] = entry.getValue();
            }

            String sql = String.format("INSERT INTO %s (%s) VALUES (%s)", tableName, columns, values);
            secondaryJdbcTemplate.update(sql, args);
        }
    }
}
