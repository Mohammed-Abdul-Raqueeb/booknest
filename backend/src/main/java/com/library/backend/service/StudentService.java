package com.library.backend.service;

import com.library.backend.dto.AuthResponse;
import com.library.backend.dto.LoginRequest;
import com.library.backend.dto.RegisterRequest;
import com.library.backend.dto.StudentUpdateRequest;
import com.library.backend.exception.BadRequestException;
import com.library.backend.exception.ResourceNotFoundException;
import com.library.backend.model.Role;
import com.library.backend.model.Student;
import com.library.backend.repository.StudentRepository;
import com.library.backend.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (studentRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        Student student = new Student();
        student.setFullName(request.getFullName());
        student.setUsername(request.getUsername());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setRole(Role.STUDENT);

        Student saved = studentRepository.save(student);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier() == null ? "" : request.getIdentifier().trim();

        Student student = studentRepository.findByUsername(identifier)
                .or(() -> studentRepository.findByEmail(identifier))
                .orElseThrow(() -> new BadRequestException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new BadRequestException("Invalid username/email or password");
        }

        return buildAuthResponse(student);
    }

    private AuthResponse buildAuthResponse(Student student) {
        String token = jwtUtil.generateToken(student.getUsername(), student.getRole().name(), student.getId());
        return new AuthResponse(
                student.getId(),
                student.getUsername(),
                student.getFullName(),
                student.getEmail(),
                student.getRole().name(),
                token
        );
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    public Student updateStudent(Long id, StudentUpdateRequest request) {
        Student student = getStudentById(id);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            student.setFullName(request.getFullName());
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(student.getUsername())) {
            if (studentRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            student.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equals(student.getEmail())) {
            if (studentRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("An account with this email already exists");
            }
            student.setEmail(request.getEmail());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null
                    || !passwordEncoder.matches(request.getCurrentPassword(), student.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        studentRepository.deleteById(id);
    }
}
