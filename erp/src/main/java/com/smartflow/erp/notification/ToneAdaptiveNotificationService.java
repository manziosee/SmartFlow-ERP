package com.smartflow.erp.notification;

import com.smartflow.erp.invoice.Invoice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ToneAdaptiveNotificationService {

    public enum NotificationTone {
        FRIENDLY, FIRM, URGENT, LEGAL
    }

    private static final Map<Integer, NotificationTone> STAGE_MAP = new HashMap<>();

    static {
        STAGE_MAP.put(0, NotificationTone.FRIENDLY);
        STAGE_MAP.put(1, NotificationTone.FRIENDLY);
        STAGE_MAP.put(2, NotificationTone.FIRM);
        STAGE_MAP.put(3, NotificationTone.URGENT);
    }

    public String generateRecoveryMessage(Invoice invoice) {
        int count = invoice.getReminderCount() != null ? invoice.getReminderCount() : 0;
        NotificationTone tone = STAGE_MAP.getOrDefault(count, NotificationTone.LEGAL);
        
        return switch (tone) {
            case FRIENDLY -> String.format(
                "Hello %s, this is a friendly reminder for invoice %s of %s %s due on %s. We appreciate your business!",
                invoice.getClient().getName(), invoice.getInvoiceNumber(), 
                invoice.getAmount(), invoice.getCurrency(), invoice.getDueDate()
            );
            case FIRM -> String.format(
                "Dear %s, your payment for invoice %s is now overdue. Please settle the amount of %s %s at your earliest convenience.",
                invoice.getClient().getName(), invoice.getInvoiceNumber(), 
                invoice.getAmount(), invoice.getCurrency()
            );
            case URGENT -> String.format(
                "URGENT: Invoice %s is significantly overdue. Please confirm payment of %s %s immediately to avoid service interruption.",
                invoice.getInvoiceNumber(), invoice.getAmount(), invoice.getCurrency()
            );
            case LEGAL -> String.format(
                "FINAL NOTICE: Regarding invoice %s. Failure to pay %s %s within 24 hours will result in the matter being handed over to debt recovery agents.",
                invoice.getInvoiceNumber(), invoice.getAmount(), invoice.getCurrency()
            );
        };
    }

    public void sendReminder(Invoice invoice) {
        String message = generateRecoveryMessage(invoice);
        // Simulate sending via Email/SMS
        System.out.println("--- SENDING NOTIFICATION ---");
        System.out.println("To: " + invoice.getClient().getContactEmail());
        System.out.println("Message: " + message);
        System.out.println("---------------------------");
        
        // Update invoice audit
        invoice.setReminderCount((invoice.getReminderCount() != null ? invoice.getReminderCount() : 0) + 1);
        invoice.setLastReminderSentAt(java.time.LocalDateTime.now());
    }
}
