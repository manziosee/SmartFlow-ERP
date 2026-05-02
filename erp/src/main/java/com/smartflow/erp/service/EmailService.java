package com.smartflow.erp.service;

import com.smartflow.erp.invoice.Invoice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * B4/B5/B17: Centralised email sender.
 * All methods swallow MailException so a missing SMTP config never crashes the app.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@smartflow-erp.com}")
    private String fromAddress;

    // ------------------------------------------------- password reset (B4/B5)
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "SmartFlow ERP — Password Reset";
        String body = "Hello,\n\n"
                + "You requested a password reset for your SmartFlow ERP account.\n\n"
                + "Click the link below to reset your password (valid for 1 hour):\n"
                + resetLink + "\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "— SmartFlow ERP Team";
        sendEmail(toEmail, subject, body);
    }

    // --------------------------------------- invoice created notification (B17)
    public void sendInvoiceCreatedNotification(Invoice invoice) {
        if (invoice.getClient() == null || invoice.getClient().getEmail() == null
                || invoice.getClient().getEmail().isBlank()) {
            log.debug("Skipping invoice-created email: no client email on invoice {}",
                    invoice.getInvoiceNumber());
            return;
        }

        String toEmail = invoice.getClient().getEmail();
        String subject = "Invoice " + invoice.getInvoiceNumber() + " — SmartFlow ERP";
        String body = "Dear " + invoice.getClient().getName() + ",\n\n"
                + "A new invoice has been created for your account:\n\n"
                + "  Invoice Number : " + invoice.getInvoiceNumber() + "\n"
                + "  Amount         : " + invoice.getAmount() + " " + invoice.getCurrency() + "\n"
                + "  Tax (VAT)      : " + invoice.getTaxAmount() + " " + invoice.getCurrency() + "\n"
                + "  Due Date       : " + invoice.getDueDate() + "\n\n"
                + "Please contact us if you have any questions.\n\n"
                + "— SmartFlow ERP Team";
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------- payment received notification (B17)
    public void sendPaymentReceivedNotification(String toEmail, String clientName,
                                                String invoiceNumber, String amount,
                                                String currency) {
        String subject = "Payment Received — Invoice " + invoiceNumber;
        String body = "Dear " + clientName + ",\n\n"
                + "We have received your payment of " + amount + " " + currency
                + " for invoice " + invoiceNumber + ".\n\n"
                + "Thank you for your prompt payment.\n\n"
                + "— SmartFlow ERP Team";
        sendEmail(toEmail, subject, body);
    }

    // --------------------------------------------------- internal helper
    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent to {} — subject: {}", to, subject);
        } catch (MailException ex) {
            log.warn("Failed to send email to {} (subject: {}): {}", to, subject, ex.getMessage());
        }
    }
}
