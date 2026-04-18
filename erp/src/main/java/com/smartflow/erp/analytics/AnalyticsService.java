package com.smartflow.erp.analytics;

import com.smartflow.erp.invoice.Invoice;
import com.smartflow.erp.invoice.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final InvoiceRepository invoiceRepository;

    public Map<String, Object> getFinancialSummary() {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        
        BigDecimal totalRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.PAID)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstandingAmount = allInvoices.stream()
                .filter(i -> i.getStatus() != Invoice.Status.PAID)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long overdueCount = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.OVERDUE)
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("outstandingAmount", outstandingAmount);
        summary.put("overdueCount", overdueCount);
        summary.put("currency", "RWF");
        
        return summary;
    }

    /**
     * Forecasts cashflow for the next 30 days based on due dates
     */
    public Map<LocalDate, BigDecimal> getCashflowForecast() {
        List<Invoice> pendingInvoices = invoiceRepository.findByStatus(Invoice.Status.PENDING);
        
        return pendingInvoices.stream()
                .collect(Collectors.groupingBy(
                        Invoice::getDueDate,
                        Collectors.reducing(BigDecimal.ZERO, Invoice::getAmount, BigDecimal::add)
                ));
    }

    /**
     * Identifies top cashflow risks (highly overdue or high-amount risky invoices)
     */
    public List<Invoice> getHighRiskInvoices() {
        return invoiceRepository.findByStatus(Invoice.Status.OVERDUE).stream()
                .filter(i -> i.getAmount().compareTo(new BigDecimal("5000")) > 0)
                .limit(5)
                .collect(Collectors.toList());
    }
}
