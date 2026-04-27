package com.smartflow.erp.tax;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxRuleRepository extends JpaRepository<TaxRule, Long> {
}
