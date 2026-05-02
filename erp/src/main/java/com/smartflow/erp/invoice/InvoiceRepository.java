package com.smartflow.erp.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(Long clientId);
    List<Invoice> findByStatus(Invoice.Status status);
    List<Invoice> findByClientIdAndStatus(Long clientId, Invoice.Status status);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    // B8: Search by invoice number or client name
    @Query("SELECT i FROM Invoice i WHERE " +
           "LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(i.client.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Invoice> searchInvoices(@Param("q") String query);

    // B13: Find invoices past due that aren't yet OVERDUE
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :today AND i.status IN ('PENDING', 'SENT')")
    List<Invoice> findOverdueInvoices(@Param("today") LocalDate today);

    // B12: Get the max invoice sequence number
    @Query("SELECT MAX(i.id) FROM Invoice i")
    Optional<Long> findMaxId();
}
