package com.library.backend.config;

import com.library.backend.model.Role;
import com.library.backend.model.Student;
import com.library.backend.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_USERNAME}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    public DataSeeder(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        Student admin = studentRepository.findByUsername(adminUsername)
                .orElseGet(() -> {
                    Student newAdmin = new Student();
                    newAdmin.setFullName("Library Admin");
                    newAdmin.setUsername(adminUsername);
                    newAdmin.setEmail("admin@library.system");
                    newAdmin.setRole(Role.ADMIN);
                    return newAdmin;
                });

        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);

        studentRepository.save(admin);
    }
}