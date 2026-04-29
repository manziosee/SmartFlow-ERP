package com.smartflow.erp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/v1/debug/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/api/v1/users", "/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/backups", "/api/v1/backups/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/clients", "/api/v1/clients/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT")
                        .requestMatchers("/api/v1/payments", "/api/v1/payments/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT")
                        .requestMatchers("/api/v1/invoices", "/api/v1/invoices/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT", "CLIENT", "RECOVERY_AGENT")
                        .requestMatchers("/api/v1/recovery", "/api/v1/recovery/**").hasAnyRole("ADMIN", "MANAGER", "RECOVERY_AGENT")
                        .requestMatchers("/api/v1/marketplace", "/api/v1/marketplace/**").hasRole("CLIENT")
                        .requestMatchers("/api/v1/analytics", "/api/v1/analytics/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/api/v1/expenses", "/api/v1/expenses/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/api/v1/notifications", "/api/v1/notifications/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/api/v1/assistant", "/api/v1/assistant/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT")
                        .requestMatchers("/api/v1/vendors", "/api/v1/vendors/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/api/v1/inventory", "/api/v1/inventory/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/api/v1/config", "/api/v1/config/**").hasAnyRole("ADMIN", "MANAGER", "ACCOUNTANT")
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/health", "/").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://smartflow-erp.com",
                "https://www.smartflow-erp.com"
        ));
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app",
                "https://*.fly.dev",
                "https://*.netlify.app",
                "https://*.railway.app",
                "https://*.onrender.com",
                "https://*-manziosee.vercel.app",
                "https://manziosee-*-vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
