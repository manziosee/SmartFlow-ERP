package com.smartflow.erp.controller;

import io.sentry.Sentry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/debug")
@Tag(name = "Debug Utilities", description = "Endpoints for system verification and health checks.")
public class SentryTestController {

    @GetMapping("/sentry-test")
    @Operation(summary = "Trigger a test exception", description = "Creates an intentional error to verify that Sentry is correctly capturing and reporting exceptions.")
    public String triggerTestError() {
        try {
            throw new Exception("This is a SmartFlow ERP Sentry Test.");
        } catch (Exception e) {
            Sentry.captureException(e);
            return "Test exception captured and sent to Sentry. Please check your dashboard.";
        }
    }
}
