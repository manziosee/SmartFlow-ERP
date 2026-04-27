package com.smartflow.erp.hr;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hr/payroll")
@RequiredArgsConstructor
public class PayrollController {

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculatePayroll(@RequestBody Map<String, Object> request) {
        // Simple simulation of payroll calculation with tax deductions
        BigDecimal grossAmount = new BigDecimal(request.get("grossAmount").toString());
        BigDecimal taxRate = new BigDecimal("0.30"); // 30% PAYE for Rwanda (simulated)
        BigDecimal taxAmount = grossAmount.multiply(taxRate);
        BigDecimal netAmount = grossAmount.subtract(taxAmount);

        Map<String, Object> result = new HashMap<>();
        result.put("grossAmount", grossAmount);
        result.put("taxAmount", taxAmount);
        result.put("netAmount", netAmount);
        result.put("status", "SUCCESS");
        result.put("message", "Payroll processed for all employees.");

        return ResponseEntity.ok(result);
    }

    @GetMapping("/report/export")
    public ResponseEntity<String> exportPayrollReport() {
        // In a real app, this would generate a PDF or CSV
        return ResponseEntity.ok("Payroll report generated and ready for download.");
    }

    @GetMapping("/benefits")
    public ResponseEntity<Map<String, Object>> getBenefitsSummary() {
        Map<String, Object> benefits = new HashMap<>();
        benefits.put("healthInsurance", "Standard Plan");
        benefits.put("pension", "Company Match 5%");
        return ResponseEntity.ok(benefits);
    }

    @GetMapping("/compliance")
    public ResponseEntity<Map<String, Object>> getComplianceSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("taxJurisdiction", "Rwanda");
        settings.put("filingFrequency", "MONTHLY");
        return ResponseEntity.ok(settings);
    }
}
