package com.smartflow.erp.expense;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "APIs for tracking and approving company expenses.")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    @GetMapping
    @Operation(summary = "Get all expenses")
    public List<Expense> getAllExpenses(@RequestParam(required = false) String period) {
        List<Expense> expenses = expenseRepository.findAll();
        if (period != null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            return expenses.stream().filter(e -> {
                if (e.getDate() == null) return false;
                switch (period) {
                    case "this-month": return e.getDate().getMonth() == now.getMonth() && e.getDate().getYear() == now.getYear();
                    case "last-month": return e.getDate().isAfter(now.minusMonths(1).withDayOfMonth(1).minusDays(1)) && e.getDate().isBefore(now.withDayOfMonth(1));
                    case "this-quarter": return e.getDate().isAfter(now.minusMonths(3));
                    case "this-year": return e.getDate().getYear() == now.getYear();
                    default: return true;
                }
            }).toList();
        }
        return expenses;
    }

    @PostMapping
    @Operation(summary = "Create a new expense")
    public Expense createExpense(@RequestBody Expense expense, @AuthenticationPrincipal com.smartflow.erp.auth.User user) {
        expense.setSubmittedBy(user);
        return expenseRepository.save(expense);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense details) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setDescription(details.getDescription());
            expense.setAmount(details.getAmount());
            expense.setCategory(details.getCategory());
            expense.setStatus(details.getStatus());
            expense.setDate(details.getDate());
            return ResponseEntity.ok(expenseRepository.save(expense));
        }).orElse(ResponseEntity.notFound().build());
    }
}
