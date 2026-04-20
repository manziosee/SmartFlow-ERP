package com.smartflow.erp.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(Long clientId);
    List<Invoice> findByStatus(Invoice.Status status);
    List<Invoice> findByClientIdAndStatus(Long clientId, Invoice.Status status);
}
