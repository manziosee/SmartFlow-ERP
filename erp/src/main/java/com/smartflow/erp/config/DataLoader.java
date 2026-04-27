package com.smartflow.erp.config;

import com.smartflow.erp.auth.User;
import com.smartflow.erp.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting production data seeding...");
        // Seed Admin User 1
        userRepository.findByEmail("seed_admin_79@smartflow.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("SmartFlow123!"));
                user.setRole(User.Role.ADMIN);
                userRepository.save(user);
            },
            () -> {
                User admin = User.builder()
                        .email("seed_admin_79@smartflow.com")
                        .password(passwordEncoder.encode("SmartFlow123!"))
                        .firstName("Seed")
                        .lastName("Admin")
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
            }
        );

        // Seed Admin User 2
        userRepository.findByEmail("manziosee3@gmail.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("Osee@12345"));
                user.setRole(User.Role.ADMIN);
                userRepository.save(user);
            },
            () -> {
                User admin = User.builder()
                        .email("manziosee3@gmail.com")
                        .password(passwordEncoder.encode("Osee@12345"))
                        .firstName("Osee")
                        .lastName("Manzi")
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
            }
        );
    }
}
