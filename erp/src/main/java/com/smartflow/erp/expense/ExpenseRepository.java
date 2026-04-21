package com.smartflow.erp.expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findBySubmittedBy_Id(Long userId);
    List<Expense> findByCategory(String category);
}
