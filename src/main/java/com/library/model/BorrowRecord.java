package com.library.model;

public class BorrowRecord {

    private int id;
    private int studentId;
    private int bookId;
    private String borrowDate;
    private String dueDate;
    private String returnDate;
    private boolean returned;

    public BorrowRecord() {
    }

    public BorrowRecord(int id, int studentId, int bookId,
                        String borrowDate,
                        String dueDate,
                        String returnDate,
                        boolean returned) {

        this.id = id;
        this.studentId = studentId;
        this.bookId = bookId;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.returned = returned;
    }

    public int getId() {
        return id;
    }

    public int getStudentId() {
        return studentId;
    }

    public int getBookId() {
        return bookId;
    }

    public String getBorrowDate() {
        return borrowDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public boolean isReturned() {
        return returned;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public void setBorrowDate(String borrowDate) {
        this.borrowDate = borrowDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public void setReturnDate(String returnDate) {
        this.returnDate = returnDate;
    }

    public void setReturned(boolean returned) {
        this.returned = returned;
    }

}