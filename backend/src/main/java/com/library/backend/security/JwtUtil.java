package com.library.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;

/**
 * Minimal, dependency-free HMAC-SHA256 signed token generator/validator.
 * Produces a standard three-part JWT (header.payload.signature) using only
 * the JDK's built-in crypto and Base64 support, so no extra Maven
 * dependency is required.
 */
@Component
public class JwtUtil {

    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(String username, String role, Long userId) {
        long nowSeconds = Instant.now().getEpochSecond();
        long expSeconds = nowSeconds + (expirationMs / 1000);

        String payloadJson = "{"
                + "\"sub\":\"" + escape(username) + "\","
                + "\"role\":\"" + escape(role) + "\","
                + "\"uid\":" + userId + ","
                + "\"iat\":" + nowSeconds + ","
                + "\"exp\":" + expSeconds
                + "}";

        String headerB64 = base64UrlEncode(HEADER_JSON.getBytes(StandardCharsets.UTF_8));
        String payloadB64 = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signingInput = headerB64 + "." + payloadB64;
        String signature = sign(signingInput);

        return signingInput + "." + signature;
    }

    public JwtClaims validateToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Malformed token");
        }

        String signingInput = parts[0] + "." + parts[1];
        String expectedSignature = sign(signingInput);
        if (!expectedSignature.equals(parts[2])) {
            throw new IllegalArgumentException("Invalid token signature");
        }

        String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);

        String username = extractStringField(payloadJson, "sub");
        String role = extractStringField(payloadJson, "role");
        Long userId = extractLongField(payloadJson, "uid");
        long exp = extractLongField(payloadJson, "exp");

        if (Instant.now().getEpochSecond() > exp) {
            throw new IllegalArgumentException("Token has expired");
        }

        return new JwtClaims(username, role, userId);
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64UrlEncode(rawHmac);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("Could not sign token", e);
        }
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static byte[] base64UrlDecode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private static String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String extractStringField(String json, String field) {
        String marker = "\"" + field + "\":\"";
        int start = json.indexOf(marker);
        if (start == -1) {
            return null;
        }
        start += marker.length();
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }

    private static long extractLongField(String json, String field) {
        String marker = "\"" + field + "\":";
        int start = json.indexOf(marker);
        if (start == -1) {
            throw new IllegalArgumentException("Missing field: " + field);
        }
        start += marker.length();
        int end = start;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '-')) {
            end++;
        }
        return Long.parseLong(json.substring(start, end));
    }

    public static class JwtClaims {
        private final String username;
        private final String role;
        private final Long userId;

        public JwtClaims(String username, String role, Long userId) {
            this.username = username;
            this.role = role;
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }

        public Long getUserId() {
            return userId;
        }
    }
}
