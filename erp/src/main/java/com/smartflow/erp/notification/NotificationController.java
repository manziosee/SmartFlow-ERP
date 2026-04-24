package com.smartflow.erp.notification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "System alerts and user notifications.")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    @Operation(summary = "Get current user notifications")
    public List<Notification> getMyNotifications(@org.springframework.security.core.annotation.AuthenticationPrincipal com.smartflow.erp.auth.User user) {
        return notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(user.getId());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public void markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
