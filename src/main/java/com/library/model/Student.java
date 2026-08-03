package com.library.model;

public class Student extends User {

    public Student() {
    }

    public Student(int id, String fullName, String username, String email, String password) {
        super(id, fullName, username, email, password);
    }
}