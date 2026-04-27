package com.smartflow.erp.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/debug")
@RequiredArgsConstructor
@Slf4j
public class DebugController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.ok(Map.of("message", "No authentication found"));
        }
        
        return ResponseEntity.ok(Map.of(
            "principal", auth.getPrincipal().toString(),
            "authorities", auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList()),
            "isAuthenticated", auth.isAuthenticated()
        ));
    }

    @GetMapping("/reset-admins")
    public ResponseEntity<?> resetAdmins() {
        log.info("Manual admin reset triggered via /api/v1/debug/reset-admins");
        
        resetUser("seed_admin_79@smartflow.com", "SmartFlow123!", "Seed Admin");
        resetUser("manziosee3@gmail.com", "Osee@12345", "Osee Manzi");
        
        return ResponseEntity.ok(Map.of("message", "Admins reset successfully"));
    }

    private void resetUser(String email, String password, String name) {
        String[] nameParts = name.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        userRepository.findByEmail(email).ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode(password));
                user.setRole(User.Role.ADMIN);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                userRepository.save(user);
                log.info("Updated existing user: {}", email);
            },
            () -> {
                User admin = User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .firstName(firstName)
                        .lastName(lastName)
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                log.info("Created new user: {}", email);
            }
        );
    }
}
