package com.smartflow.erp.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByPerformedBy_Id(Long userId);
    List<AuditLog> findByAction(String action);
}
