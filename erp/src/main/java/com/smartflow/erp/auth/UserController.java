package com.smartflow.erp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        // Enforce company isolation: only return users with the same company name
        return ResponseEntity.ok(userRepository.findAll().stream()
            .filter(u -> u.getCompanyName() != null && u.getCompanyName().equals(currentUser.getCompanyName()))
            .toList());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        // Force new user to belong to the admin's company
        user.setCompanyName(currentUser.getCompanyName());
        
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // Default temporary password
            user.setPassword(passwordEncoder.encode("SmartFlow123!"));
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userUpdates, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        return userRepository.findById(id).map(existingUser -> {
            if (!existingUser.getCompanyName().equals(currentUser.getCompanyName())) {
                return ResponseEntity.status(403).<User>build();
            }
            if (userUpdates.getFirstName() != null) existingUser.setFirstName(userUpdates.getFirstName());
            if (userUpdates.getLastName() != null) existingUser.setLastName(userUpdates.getLastName());
            if (userUpdates.getRole() != null) existingUser.setRole(userUpdates.getRole());
            // Do not allow changing companyName
            return ResponseEntity.ok(userRepository.save(existingUser));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> request, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "newPassword is required"));
        }
        
        return userRepository.findById(id).map(user -> {
            if (!user.getCompanyName().equals(currentUser.getCompanyName())) {
                return ResponseEntity.status(403).build();
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser) {
        return userRepository.findById(id).map(user -> {
            if (!user.getCompanyName().equals(currentUser.getCompanyName())) {
                return ResponseEntity.status(403).<Void>build();
            }
            userRepository.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
