package com.library.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRepository;

public class BorrowService {

    private final BookRepository bookRepository = new BookRepository();
    private final BorrowRepository borrowRepository = new BorrowRepository();
    private final FineService fineService = new FineService();

    public void borrowBook(int studentId, int bookId) {

        Book book = bookRepository.findBookById(bookId);

        if (book == null) {
            System.out.println("\n❌ Book Not Found.");
            return;
        }

        if (!book.isAvailable()) {
            System.out.println("\n❌ Book Already Borrowed.");
            return;
        }

        BorrowRecord record = new BorrowRecord(
                0,
                studentId,
                bookId,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(14).toString(),
                null,
                false
        );

        if (borrowRepository.borrowBook(record)) {

            book.setAvailable(false);
            bookRepository.updateBook(book);

            System.out.println("\n✅ Book Borrowed Successfully.");

        } else {
            System.out.println("\n❌ Borrow Failed.");
        }
    }

    public void returnBook(int bookId) {

        Book book = bookRepository.findBookById(bookId);

        if (book == null) {
            System.out.println("\n❌ Book Not Found.");
            return;
        }

        if (book.isAvailable()) {
            System.out.println("\n❌ This Book Is Already Available.");
            return;
        }

        BorrowRecord record = borrowRepository.getActiveBorrowRecord(bookId);

        if (record == null) {
            System.out.println("\n❌ Borrow Record Not Found.");
            return;
        }

        String returnDate = LocalDate.now().toString();

        int fine = fineService.calculateFine(
                record.getDueDate(),
                returnDate
        );

        if (borrowRepository.returnBook(bookId)) {

            book.setAvailable(true);
            bookRepository.updateBook(book);

            System.out.println("\n✅ Book Returned Successfully.");
            System.out.println("--------------------------------");
            System.out.println("Due Date    : " + record.getDueDate());
            System.out.println("Return Date : " + returnDate);
            System.out.println("Fine Amount : ₹" + fine);
            System.out.println("--------------------------------");

        } else {
            System.out.println("\n❌ Return Failed.");
        }
    }

    public void showBorrowHistory() {

        List<BorrowRecord> records = borrowRepository.getBorrowHistory();

        if (records.isEmpty()) {
            System.out.println("\nNo Borrow Records Found.");
            return;
        }

        System.out.println("\n========== BORROW HISTORY ==========\n");

        for (BorrowRecord record : records) {

            System.out.println("Record ID    : " + record.getId());
            System.out.println("Student ID   : " + record.getStudentId());
            System.out.println("Book ID      : " + record.getBookId());
            System.out.println("Borrow Date  : " + record.getBorrowDate());
            System.out.println("Due Date     : " + record.getDueDate());
            System.out.println("Return Date  : " + record.getReturnDate());
            System.out.println("Returned     : " + (record.isReturned() ? "Yes" : "No"));
            System.out.println("------------------------------------------");
        }
    }

    public void showStudentHistory(int studentId) {

        List<BorrowRecord> records = borrowRepository.getStudentHistory(studentId);

        if (records.isEmpty()) {
            System.out.println("\nNo Borrow History Found.");
            return;
        }

        System.out.println("\n======= STUDENT BORROW HISTORY =======\n");

        for (BorrowRecord record : records) {

            System.out.println("Book ID      : " + record.getBookId());
            System.out.println("Borrow Date  : " + record.getBorrowDate());
            System.out.println("Due Date     : " + record.getDueDate());
            System.out.println("Return Date  : " + record.getReturnDate());
            System.out.println("Returned     : " + (record.isReturned() ? "Yes" : "No"));
            System.out.println("------------------------------------------");
        }
    }

    public void showOverdueBooks() {

        List<BorrowRecord> records = borrowRepository.getOverdueBooks();

        if (records.isEmpty()) {
            System.out.println("\nNo Overdue Books Found.");
            return;
        }

        System.out.println("\n========== OVERDUE BOOKS ==========\n");

        for (BorrowRecord record : records) {

            int lateDays = (int) ChronoUnit.DAYS.between(
                    LocalDate.parse(record.getDueDate()),
                    LocalDate.now()
            );

            System.out.println("Record ID    : " + record.getId());
            System.out.println("Student ID   : " + record.getStudentId());
            System.out.println("Book ID      : " + record.getBookId());
            System.out.println("Borrow Date  : " + record.getBorrowDate());
            System.out.println("Due Date     : " + record.getDueDate());
            System.out.println("Late Days    : " + lateDays);
            System.out.println("Fine         : ₹" + (lateDays * 10));
            System.out.println("------------------------------------");
        }
    }
}