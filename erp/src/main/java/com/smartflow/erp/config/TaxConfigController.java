package com.smartflow.erp.config;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/config/taxes")
@RequiredArgsConstructor
public class TaxConfigController {

    private final TaxRuleRepository taxRuleRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<List<TaxRule>> getTaxes() {
        return ResponseEntity.ok(taxRuleRepository.findAll());
    }
}
