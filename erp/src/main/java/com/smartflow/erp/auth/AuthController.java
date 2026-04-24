package com.smartflow.erp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtUtil.generateToken(userDetails);

        User user = (User) userDetails;

        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "id", user.getId().toString(),
                "email", user.getEmail(),
                "name", user.getFirstName() + " " + user.getLastName(),
                "role", user.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        String name = request.getOrDefault("name", "");
        String[] nameParts = name.split(" ", 2);
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        User.Role assignedRole = userRepository.count() == 0 ? User.Role.ADMIN : User.Role.CLIENT;

        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.get("password")))
                .firstName(firstName)
                .lastName(lastName)
                .companyName(request.get("company"))
                .role(assignedRole)
                .build();

        userRepository.save(newUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwtToken = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "id", newUser.getId().toString(),
                "email", newUser.getEmail(),
                "name", newUser.getFirstName() + " " + newUser.getLastName(),
                "role", newUser.getRole().name()
        ));
    }
}
