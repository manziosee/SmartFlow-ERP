package com.smartflow.erp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class SchemaMigrationService {

    @Value("${spring.secondary.datasource.url}")
    private String secondaryUrl;

    @Value("${spring.secondary.datasource.token}")
    private String authToken;

    private final JdbcTemplate primaryJdbcTemplate;
    private final JdbcTemplate secondaryJdbcTemplate;

    public SchemaMigrationService(
            JdbcTemplate primaryJdbcTemplate,
            @Qualifier("secondaryJdbcTemplate") JdbcTemplate secondaryJdbcTemplate) {
        this.primaryJdbcTemplate = primaryJdbcTemplate;
        this.secondaryJdbcTemplate = secondaryJdbcTemplate;
    }

    /**
     * Initializes the schemas for both Neon (Primary) and Turso (Secondary).
     */
    @PostConstruct
    public void migrateSchemas() {
        log.info("--- Starting Dual-DB Schema Migration Phase ---");
        
        // 1. Neon Migration
        try {
            log.info("Migrating Neon...");
            primaryJdbcTemplate.execute("CREATE TABLE IF NOT EXISTS expenses (id SERIAL PRIMARY KEY, description VARCHAR(255), amount DECIMAL(19,2), category VARCHAR(100), date DATE, status VARCHAR(50), user_id BIGINT)");
            primaryJdbcTemplate.execute("CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, title VARCHAR(255), message TEXT, created_at TIMESTAMP, read BOOLEAN, user_id BIGINT)");
            log.info("Neon Migration Success.");
        } catch (Exception e) {
            log.error("Neon Error: {}", e.getMessage());
        }

        // 2. Turso Migration (Native JDBC)
        try {
            log.info("Migrating Turso with Native JDBC...");
            
            java.util.Properties props = new java.util.Properties();
            props.setProperty("authToken", authToken);
            props.setProperty("password", authToken);
            
            try (java.sql.Connection conn = java.sql.DriverManager.getConnection(secondaryUrl, props)) {
                log.info("Turso Native Connection Success!");
                String[] tables = {
                    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT, full_name TEXT, client_id INTEGER)",
                    "CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, company TEXT, address TEXT, industry TEXT, revenue REAL)",
                    "CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, client_id INTEGER, amount REAL, status TEXT, issue_date TEXT, due_date TEXT, paid_date TEXT)",
                    "CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id INTEGER, amount REAL, method TEXT, status TEXT, date TEXT, reference TEXT)",
                    "CREATE TABLE IF NOT EXISTS recovery_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_id INTEGER, status TEXT, priority TEXT, assigned_agent_id INTEGER)",
                    "CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT, user_id INTEGER, timestamp TEXT, details TEXT, entity_id TEXT)",
                    "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, amount REAL, category TEXT, date TEXT, status TEXT, user_id INTEGER)",
                    "CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, message TEXT, created_at TEXT, read BOOLEAN, user_id INTEGER)"
                };
                try (java.sql.Statement stmt = conn.createStatement()) {
                    for (String ddl : tables) {
                        stmt.execute(ddl);
                    }
                }
                log.info("Turso Migration Success.");
            }
        } catch (Exception e) {
            log.error("Turso Error: {}", e.getMessage());
        }
    }
}
