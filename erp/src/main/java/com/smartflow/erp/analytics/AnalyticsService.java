package com.smartflow.erp.analytics;

import com.smartflow.erp.client.ClientRepository;
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
    private final ClientRepository clientRepository;

    public Map<String, Object> getFinancialSummary(String period) {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        
        if (period != null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            allInvoices = allInvoices.stream().filter(i -> {
                if (i.getIssueDate() == null) return false;
                switch (period) {
                    case "this-month": return i.getIssueDate().getMonth() == now.getMonth() && i.getIssueDate().getYear() == now.getYear();
                    case "last-month": return i.getIssueDate().isAfter(now.minusMonths(1).withDayOfMonth(1).minusDays(1)) && i.getIssueDate().isBefore(now.withDayOfMonth(1));
                    case "this-quarter": return i.getIssueDate().isAfter(now.minusMonths(3));
                    case "this-year": return i.getIssueDate().getYear() == now.getYear();
                    default: return true;
                }
            }).collect(Collectors.toList());
        }

        BigDecimal totalRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.PAID)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstandingAmount = allInvoices.stream()
                .filter(i -> i.getStatus() != Invoice.Status.PAID && i.getStatus() != Invoice.Status.CANCELLED)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal overdueAmount = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.OVERDUE)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("outstandingAmount", outstandingAmount);
        summary.put("outstandingInvoices", outstandingAmount); // Align with frontend name
        summary.put("overdueAmount", overdueAmount);
        summary.put("paidInvoices", allInvoices.stream().filter(i -> i.getStatus() == Invoice.Status.PAID).count());
        summary.put("pendingInvoices", allInvoices.stream().filter(i -> i.getStatus() == Invoice.Status.PENDING).count());
        summary.put("activeClients", clientRepository.count());
        summary.put("clientsWithInvoices", allInvoices.stream().map(i -> i.getClient().getId()).distinct().count());
        summary.put("currency", "RWF");
        
        return summary;
    }

    public List<Map<String, Object>> getCashflowForecast(String period) {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        
        // Group by month-year for a better chart view
        Map<String, BigDecimal> inflows = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.Status.PAID || 
                             i.getStatus() == Invoice.Status.PENDING ||
                             i.getStatus() == Invoice.Status.SENT ||
                             i.getStatus() == Invoice.Status.OVERDUE)
                .filter(i -> i.getIssueDate() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getIssueDate().getYear() + "-" + String.format("%02d", i.getIssueDate().getMonthValue()),
                        Collectors.reducing(BigDecimal.ZERO, Invoice::getAmount, BigDecimal::add)
                ));

        // Mock outflows for now until expenses are fully integrated in this service
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        inflows.forEach((p, amount) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("period", p);
            entry.put("inflow", amount);
            entry.put("outflow", amount.multiply(new BigDecimal("0.4"))); // Mock 40% outflow
            entry.put("net", amount.multiply(new BigDecimal("0.6")));
            result.add(entry);
        });
        
        return result.stream().sorted((a, b) -> a.get("period").toString().compareTo(b.get("period").toString())).collect(Collectors.toList());
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
