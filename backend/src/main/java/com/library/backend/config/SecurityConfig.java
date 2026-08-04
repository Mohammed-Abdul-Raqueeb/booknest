package com.library.backend.config;

import com.library.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .headers(headers -> 
                headers.frameOptions(frame -> frame.sameOrigin())
            )
            .authorizeHttpRequests(auth -> auth

                // Allow frontend login/register
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/students/register",
                    "/api/students/login",
                    "/students/register",
                    "/students/login"
                ).permitAll()

                // Public book browsing
                .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()

                // H2 console
                .requestMatchers("/h2-console/**").permitAll()

                // Allow browser preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


                // Admin routes
                .requestMatchers(HttpMethod.POST, "/api/books/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT, "/api/books/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE, "/api/books/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/students")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE, "/api/students/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/borrow")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/borrow/active")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT, "/api/borrow/return/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")


                // Everything else requires login
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
            List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}