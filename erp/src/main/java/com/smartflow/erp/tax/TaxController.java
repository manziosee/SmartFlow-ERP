package com.smartflow.erp.tax;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/taxes")
@RequiredArgsConstructor
public class TaxController {

    private final TaxRuleRepository taxRuleRepository;

    @GetMapping("/rules")
    public ResponseEntity<List<TaxRule>> getRules() {
        return ResponseEntity.ok(taxRuleRepository.findAll());
    }

    @PostMapping("/rules")
    public ResponseEntity<TaxRule> createRule(@RequestBody TaxRule rule) {
        return ResponseEntity.ok(taxRuleRepository.save(rule));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<TaxRule> updateRule(@PathVariable Long id, @RequestBody TaxRule details) {
        return taxRuleRepository.findById(id).map(rule -> {
            rule.setRegion(details.getRegion());
            rule.setTaxType(details.getTaxType());
            rule.setRate(details.getRate());
            rule.setActive(details.isActive());
            rule.setLastUpdated(java.time.LocalDateTime.now());
            return ResponseEntity.ok(taxRuleRepository.save(rule));
        }).orElse(ResponseEntity.notFound().build());
    }
}
