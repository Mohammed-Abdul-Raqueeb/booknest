package com.library.backend.controller;

import com.library.backend.dto.BorrowRecordResponse;
import com.library.backend.security.SecurityUtils;
import com.library.backend.service.BorrowService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping("/{studentId}/{bookId}")
    public BorrowRecordResponse borrowBook(@PathVariable Long studentId,
                                            @PathVariable Long bookId,
                                            Authentication authentication) {
        SecurityUtils.requireSelfOrAdmin(studentId, authentication);
        return borrowService.borrowBook(studentId, bookId);
    }

    @PutMapping("/return/{id}")
    public BorrowRecordResponse returnBook(@PathVariable Long id) {
        return borrowService.returnBook(id);
    }

    @GetMapping
    public List<BorrowRecordResponse> getAllRecords() {
        return borrowService.getAllBorrowRecords();
    }

    @GetMapping("/student/{studentId}")
    public List<BorrowRecordResponse> getStudentHistory(@PathVariable Long studentId,
                                                          Authentication authentication) {
        SecurityUtils.requireSelfOrAdmin(studentId, authentication);
        return borrowService.getStudentHistory(studentId);
    }

    @GetMapping("/active")
    public List<BorrowRecordResponse> getActiveBorrowings() {
        return borrowService.getActiveBorrowings();
    }
}
