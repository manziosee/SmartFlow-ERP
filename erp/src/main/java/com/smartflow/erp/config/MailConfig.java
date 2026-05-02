package com.smartflow.erp.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import jakarta.mail.internet.MimeMessage;

import java.io.InputStream;

/**
 * Provides a no-op JavaMailSender when spring.mail.host is not configured.
 * This prevents startup failure when SMTP credentials are absent.
 * EmailService already catches MailException, so emails will silently be skipped.
 */
@Configuration
public class MailConfig {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender noOpMailSender() {
        return new JavaMailSender() {
            @Override
            public MimeMessage createMimeMessage() {
                throw new UnsupportedOperationException("Mail not configured");
            }

            @Override
            public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
                throw new UnsupportedOperationException("Mail not configured");
            }

            @Override
            public void send(MimeMessage mimeMessage) throws MailException {
                // no-op
            }

            @Override
            public void send(MimeMessage... mimeMessages) throws MailException {
                // no-op
            }

            @Override
            public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
                // no-op
            }

            @Override
            public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {
                // no-op
            }

            @Override
            public void send(SimpleMailMessage simpleMessage) throws MailException {
                // no-op — log is handled in EmailService
            }

            @Override
            public void send(SimpleMailMessage... simpleMessages) throws MailException {
                // no-op
            }
        };
    }
}
