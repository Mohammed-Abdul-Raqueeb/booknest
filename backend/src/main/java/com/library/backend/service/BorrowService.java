package com.library.backend.service;

import com.library.backend.dto.BorrowRecordResponse;
import com.library.backend.exception.BadRequestException;
import com.library.backend.exception.ResourceNotFoundException;
import com.library.backend.model.Book;
import com.library.backend.model.BorrowRecord;
import com.library.backend.model.Student;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.BorrowRepository;
import com.library.backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowService {

    private static final int LOAN_PERIOD_DAYS = 14;
    private static final double FINE_PER_DAY = 10.0;

    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    public BorrowService(BorrowRepository borrowRepository, BookRepository bookRepository,
                          StudentRepository studentRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
    }

    public BorrowRecordResponse borrowBook(Long studentId, Long bookId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (!book.isAvailable()) {
            throw new BadRequestException("This book is currently unavailable");
        }

        if (borrowRepository.existsByStudentIdAndBookIdAndReturnedFalse(studentId, bookId)) {
            throw new BadRequestException("You already have this book borrowed");
        }

        book.setAvailable(false);
        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setStudentId(studentId);
        record.setBookId(bookId);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(LOAN_PERIOD_DAYS));
        record.setReturned(false);
        record.setFine(0);

        BorrowRecord saved = borrowRepository.save(record);
        return toResponse(saved, student, book);
    }

    public BorrowRecordResponse returnBook(Long id) {
        BorrowRecord record = borrowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));

        if (record.isReturned()) {
            throw new BadRequestException("This book has already been returned");
        }

        record.setReturnDate(LocalDate.now());
        record.setReturned(true);
        record.setFine(calculateFine(record.getDueDate(), record.getReturnDate()));

        Book book = bookRepository.findById(record.getBookId()).orElse(null);
        if (book != null) {
            book.setAvailable(true);
            bookRepository.save(book);
        }

        BorrowRecord saved = borrowRepository.save(record);
        Student student = studentRepository.findById(saved.getStudentId()).orElse(null);
        return toResponse(saved, student, book);
    }

    public List<BorrowRecordResponse> getAllBorrowRecords() {
        return borrowRepository.findAll().stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getStudentHistory(Long studentId) {
        return borrowRepository.findByStudentId(studentId).stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getActiveBorrowings() {
        return borrowRepository.findByReturnedFalse().stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    private BorrowRecordResponse enrich(BorrowRecord record) {
        Student student = studentRepository.findById(record.getStudentId()).orElse(null);
        Book book = bookRepository.findById(record.getBookId()).orElse(null);
        return toResponse(record, student, book);
    }

    private BorrowRecordResponse toResponse(BorrowRecord record, Student student, Book book) {
        boolean overdue = !record.isReturned()
                && record.getDueDate() != null
                && LocalDate.now().isAfter(record.getDueDate());

        double fine = record.isReturned()
                ? record.getFine()
                : (overdue ? calculateFine(record.getDueDate(), LocalDate.now()) : 0);

        String status = record.isReturned() ? "RETURNED" : (overdue ? "OVERDUE" : "BORROWED");

        BorrowRecordResponse response = new BorrowRecordResponse();
        response.setId(record.getId());
        response.setStudentId(record.getStudentId());
        response.setStudentName(student != null ? student.getFullName() : "Unknown student");
        response.setBookId(record.getBookId());
        response.setBookTitle(book != null ? book.getTitle() : "Unknown book");
        response.setBookAuthor(book != null ? book.getAuthor() : null);
        response.setCoverImage(book != null ? book.getCoverImage() : null);
        response.setBorrowDate(record.getBorrowDate());
        response.setDueDate(record.getDueDate());
        response.setReturnDate(record.getReturnDate());
        response.setReturned(record.isReturned());
        response.setStatus(status);
        response.setFine(fine);
        return response;
    }

    private double calculateFine(LocalDate dueDate, LocalDate comparisonDate) {
        if (dueDate == null || comparisonDate == null || !comparisonDate.isAfter(dueDate)) {
            return 0;
        }
        long daysLate = ChronoUnit.DAYS.between(dueDate, comparisonDate);
        return daysLate * FINE_PER_DAY;
    }
}
