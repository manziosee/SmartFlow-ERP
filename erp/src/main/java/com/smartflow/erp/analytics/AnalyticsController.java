package com.smartflow.erp.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(analyticsService.getFinancialSummary(period));
    }

    @GetMapping("/cashflow")
    public ResponseEntity<List<Map<String, Object>>> getCashflowForecast(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(analyticsService.getCashflowForecast(period));
    }
}
