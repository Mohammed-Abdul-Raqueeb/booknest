package com.library.service;

import com.library.model.Student;
import com.library.repository.StudentRepository;

public class AuthenticationService {

    private StudentRepository repository = new StudentRepository();

    public boolean registerStudent(String fullName,
                                   String username,
                                   String email,
                                   String password,
                                   String confirmPassword) {

        if (fullName.isBlank() || username.isBlank() || email.isBlank()
                || password.isBlank() || confirmPassword.isBlank()) {

            System.out.println("❌ All fields are required.");
            return false;
        }

        if (!email.contains("@")) {
            System.out.println("❌ Invalid email.");
            return false;
        }

        if (password.length() < 8) {
            System.out.println("❌ Password must be at least 8 characters.");
            return false;
        }

        if (!password.equals(confirmPassword)) {
            System.out.println("❌ Passwords do not match.");
            return false;
        }

        Student student = new Student(
                0,
                fullName,
                username,
                email,
                password);

        if (repository.addStudent(student)) {
            System.out.println("✅ Registration Successful.");
            return true;
        }

        System.out.println("❌ Username or Email already exists.");
        return false;
    }

    public boolean loginStudent(String username, String password) {

        Student student = repository.login(username, password);

        if (student == null) {
            System.out.println("❌ Invalid Username or Password.");
            return false;
        }

        System.out.println("\n==================================");
        System.out.println(" Welcome " + student.getFullName());
        System.out.println("==================================");

        return true;
    }

}