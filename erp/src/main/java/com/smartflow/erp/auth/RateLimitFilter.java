package com.smartflow.erp.auth;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * B12: Simple in-memory rate limiter for /api/v1/auth/login.
 * Allows at most 5 requests per minute per IP address.
 */
@Component
@Slf4j
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_MILLIS = 60_000L;
    private static final String LOGIN_PATH = "/api/v1/auth/login";

    // Map: IP -> [requestCount, windowStartMs]
    private final ConcurrentHashMap<String, long[]> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        if (!LOGIN_PATH.equals(httpRequest.getServletPath())) {
            chain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(httpRequest);
        long now = Instant.now().toEpochMilli();

        requestCounts.compute(ip, (key, val) -> {
            if (val == null || now - val[1] > WINDOW_MILLIS) {
                return new long[]{1, now};
            }
            val[0]++;
            return val;
        });

        long[] entry = requestCounts.get(ip);
        if (entry[0] > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded for IP: {}", ip);
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                "{\"status\":429,\"error\":\"Too Many Requests\","
                + "\"message\":\"Too many login attempts. Please wait a minute and try again.\"}"
            );
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
