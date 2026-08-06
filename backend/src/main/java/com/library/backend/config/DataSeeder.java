package com.library.backend.config;

import com.library.backend.model.Role;
import com.library.backend.model.Student;
import com.library.backend.repository.StudentRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures a default administrator account exists.
 * Creates the admin user only if it does not already exist.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.findByUsername("admin").isEmpty()) {
            Student admin = new Student();
            admin.setFullName("Library Admin");
            admin.setUsername("admin");
            admin.setEmail("admin@library.system");
            admin.setPassword(passwordEncoder.encode("xxxxxxxx"));
            admin.setRole(Role.ADMIN);
            studentRepository.save(admin);
        }
    }
}
