package com.library.backend.controller;

import com.library.backend.dto.AuthResponse;
import com.library.backend.dto.LoginRequest;
import com.library.backend.dto.RegisterRequest;
import com.library.backend.dto.StudentUpdateRequest;
import com.library.backend.model.Student;
import com.library.backend.security.SecurityUtils;
import com.library.backend.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return studentService.login(request);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id, Authentication authentication) {
        SecurityUtils.requireSelfOrAdmin(id, authentication);
        return studentService.getStudentById(id);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id,
                                  @Valid @RequestBody StudentUpdateRequest request,
                                  Authentication authentication) {
        SecurityUtils.requireSelfOrAdmin(id, authentication);
        return studentService.updateStudent(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
