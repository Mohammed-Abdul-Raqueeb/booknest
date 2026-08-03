package com.library.model;

public class Admin extends User {

    public Admin() {
    }

    public Admin(int id, String fullName, String username, String email, String password) {
        super(id, fullName, username, email, password);
    }
}