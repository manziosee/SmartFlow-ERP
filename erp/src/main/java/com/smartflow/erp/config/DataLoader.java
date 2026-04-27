package com.smartflow.erp.config;

import com.smartflow.erp.auth.User;
import com.smartflow.erp.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin User 1
        if (userRepository.findByEmail("seed_admin_79@smartflow.com").isEmpty()) {
            User admin = User.builder()
                    .email("seed_admin_79@smartflow.com")
                    .password(passwordEncoder.encode("SmartFlow123!"))
                    .firstName("Seed")
                    .lastName("Admin")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Seed Admin User 2
        if (userRepository.findByEmail("manziosee3@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .email("manziosee3@gmail.com")
                    .password(passwordEncoder.encode("Osee@12345"))
                    .firstName("Osee")
                    .lastName("Manzi")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }
}
