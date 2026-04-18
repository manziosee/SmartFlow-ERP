package com.smartflow.erp.recovery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecoveryCaseRepository extends JpaRepository<RecoveryCase, Long> {
    List<RecoveryCase> findByAssignedAgentId(Long agentId);
    Optional<RecoveryCase> findByInvoiceId(Long invoiceId);
}
