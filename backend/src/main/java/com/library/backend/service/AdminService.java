package com.library.backend.service;

import com.library.backend.dto.AdminStatistics;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.BorrowRepository;
import com.library.backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AdminService {

    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;
    private final BorrowRepository borrowRepository;

    public AdminService(BookRepository bookRepository, StudentRepository studentRepository,
                         BorrowRepository borrowRepository) {
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
        this.borrowRepository = borrowRepository;
    }

    public AdminStatistics getStatistics() {
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.findByAvailableTrue().size();
        long borrowedBooks = totalBooks - availableBooks;
        long totalStudents = studentRepository.count();
        long totalBorrowRecords = borrowRepository.count();

        long activeBorrows = borrowRepository.findByReturnedFalse().size();
        long overdueBorrows = borrowRepository.findByReturnedFalse().stream()
                .filter(r -> r.getDueDate() != null && LocalDate.now().isAfter(r.getDueDate()))
                .count();

        return new AdminStatistics(
                totalBooks,
                availableBooks,
                borrowedBooks,
                totalStudents,
                totalBorrowRecords,
                activeBorrows,
                overdueBorrows
        );
    }
}
