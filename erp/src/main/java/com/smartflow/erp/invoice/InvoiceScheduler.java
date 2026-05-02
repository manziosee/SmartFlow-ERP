package com.smartflow.erp.invoice;

import com.smartflow.erp.auth.User;
import com.smartflow.erp.auth.UserRepository;
import com.smartflow.erp.notification.Notification;
import com.smartflow.erp.notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * B13 + B14: Daily job that:
 * 1. Auto-marks PENDING/SENT invoices as OVERDUE when past due date
 * 2. Creates in-app notifications for staff users about the overdue invoices
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceScheduler {

    private final InvoiceRepository invoiceRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Runs every day at 8:00 AM server time
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void markOverdueInvoices() {
        LocalDate today = LocalDate.now();

        List<Invoice> overdueInvoices = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getDueDate() != null
                        && inv.getDueDate().isBefore(today)
                        && (inv.getStatus() == Invoice.Status.PENDING
                            || inv.getStatus() == Invoice.Status.SENT))
                .toList();

        if (overdueInvoices.isEmpty()) {
            log.info("InvoiceScheduler: No new overdue invoices found.");
            return;
        }

        // Mark all as OVERDUE
        overdueInvoices.forEach(inv -> inv.setStatus(Invoice.Status.OVERDUE));
        invoiceRepository.saveAll(overdueInvoices);

        log.info("InvoiceScheduler: Marked {} invoices as OVERDUE.", overdueInvoices.size());

        // Notify all ADMIN, MANAGER, ACCOUNTANT users
        List<User> staffUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN
                        || u.getRole() == User.Role.MANAGER
                        || u.getRole() == User.Role.ACCOUNTANT)
                .toList();

        for (User staff : staffUsers) {
            Notification notification = Notification.builder()
                    .title("⚠️ " + overdueInvoices.size() + " Invoice(s) Now Overdue")
                    .message(overdueInvoices.size() + " invoice(s) passed their due date and are now marked OVERDUE. "
                            + "Earliest: " + overdueInvoices.stream()
                                .map(i -> i.getInvoiceNumber() + " (" + i.getClient().getName() + ")")
                                .limit(3)
                                .reduce((a, b) -> a + ", " + b)
                                .orElse("")
                            + (overdueInvoices.size() > 3 ? " and " + (overdueInvoices.size() - 3) + " more." : "."))
                    .recipient(staff)
                    .build();
            notificationRepository.save(notification);
        }

        log.info("InvoiceScheduler: Sent overdue notifications to {} staff users.", staffUsers.size());
    }

    // Also runs every hour to catch invoices that became overdue mid-day
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void hourlyOverdueCheck() {
        LocalDate today = LocalDate.now();
        invoiceRepository.findAll().stream()
                .filter(inv -> inv.getDueDate() != null
                        && inv.getDueDate().isBefore(today)
                        && (inv.getStatus() == Invoice.Status.PENDING
                            || inv.getStatus() == Invoice.Status.SENT))
                .forEach(inv -> {
                    inv.setStatus(Invoice.Status.OVERDUE);
                    invoiceRepository.save(inv);
                });
    }
}
