package com.library.backend.dto;

public class AdminStatistics {

    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long totalStudents;
    private long totalBorrowRecords;
    private long activeBorrows;
    private long overdueBorrows;

    public AdminStatistics() {
    }

    public AdminStatistics(long totalBooks, long availableBooks, long borrowedBooks,
                            long totalStudents, long totalBorrowRecords,
                            long activeBorrows, long overdueBorrows) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.borrowedBooks = borrowedBooks;
        this.totalStudents = totalStudents;
        this.totalBorrowRecords = totalBorrowRecords;
        this.activeBorrows = activeBorrows;
        this.overdueBorrows = overdueBorrows;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(long borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalBorrowRecords() {
        return totalBorrowRecords;
    }

    public void setTotalBorrowRecords(long totalBorrowRecords) {
        this.totalBorrowRecords = totalBorrowRecords;
    }

    public long getActiveBorrows() {
        return activeBorrows;
    }

    public void setActiveBorrows(long activeBorrows) {
        this.activeBorrows = activeBorrows;
    }

    public long getOverdueBorrows() {
        return overdueBorrows;
    }

    public void setOverdueBorrows(long overdueBorrows) {
        this.overdueBorrows = overdueBorrows;
    }
}
