package com.library.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseConnection {

    private static final String URL = "jdbc:sqlite:library.db";

    public static Connection getConnection() {

        try {

            return DriverManager.getConnection(URL);

        } catch (SQLException e) {

            throw new RuntimeException(e);

        }

    }

    public static void initializeDatabase() {

        try (
                Connection conn = getConnection();
                Statement stmt = conn.createStatement()) {

            stmt.execute("""
                    CREATE TABLE IF NOT EXISTS students(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        full_name TEXT NOT NULL,
                        username TEXT UNIQUE NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL
                    );
                    """);

            stmt.execute("""
                    CREATE TABLE IF NOT EXISTS books(
                        id INTEGER PRIMARY KEY,
                        title TEXT NOT NULL,
                        author TEXT NOT NULL,
                        category TEXT NOT NULL,
                        isbn TEXT UNIQUE NOT NULL,
                        available INTEGER DEFAULT 1
                    );
                    """);

            stmt.execute("""
                    CREATE TABLE IF NOT EXISTS borrow_records(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        student_id INTEGER NOT NULL,
                        book_id INTEGER NOT NULL,
                        borrow_date TEXT NOT NULL,
                        due_date TEXT NOT NULL,
                        return_date TEXT,
                        returned INTEGER DEFAULT 0,
                        FOREIGN KEY(student_id) REFERENCES students(id),
                        FOREIGN KEY(book_id) REFERENCES books(id)
                    );
                    """);

            System.out.println("✅ Database Ready.");

        } catch (SQLException e) {

            e.printStackTrace();

        }

    }

}