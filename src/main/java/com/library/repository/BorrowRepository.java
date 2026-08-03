package com.library.repository;

import com.library.config.DatabaseConnection;
import com.library.model.BorrowRecord;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BorrowRepository {

    public boolean borrowBook(BorrowRecord record) {

        String sql = """
                INSERT INTO borrow_records
                (student_id, book_id, borrow_date, due_date, return_date, returned)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {

            ps.setInt(1, record.getStudentId());
            ps.setInt(2, record.getBookId());
            ps.setString(3, record.getBorrowDate());
            ps.setString(4, record.getDueDate());
            ps.setString(5, record.getReturnDate());
            ps.setBoolean(6, record.isReturned());

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public BorrowRecord getActiveBorrowRecord(int bookId) {

        String sql = """
                SELECT *
                FROM borrow_records
                WHERE book_id = ?
                AND returned = 0
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {

            ps.setInt(1, bookId);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {
                    return new BorrowRecord(
                            rs.getInt("id"),
                            rs.getInt("student_id"),
                            rs.getInt("book_id"),
                            rs.getString("borrow_date"),
                            rs.getString("due_date"),
                            rs.getString("return_date"),
                            rs.getBoolean("returned")
                    );
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public boolean returnBook(int bookId) {

        String sql = """
                UPDATE borrow_records
                SET returned = 1,
                    return_date = ?
                WHERE book_id = ?
                AND returned = 0
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {

            ps.setString(1, java.time.LocalDate.now().toString());
            ps.setInt(2, bookId);

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<BorrowRecord> getBorrowHistory() {

        List<BorrowRecord> list = new ArrayList<>();

        String sql = """
                SELECT *
                FROM borrow_records
                ORDER BY borrow_date DESC
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)
        ) {

            while (rs.next()) {

                list.add(new BorrowRecord(
                        rs.getInt("id"),
                        rs.getInt("student_id"),
                        rs.getInt("book_id"),
                        rs.getString("borrow_date"),
                        rs.getString("due_date"),
                        rs.getString("return_date"),
                        rs.getBoolean("returned")
                ));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public List<BorrowRecord> getStudentHistory(int studentId) {

        List<BorrowRecord> list = new ArrayList<>();

        String sql = """
                SELECT *
                FROM borrow_records
                WHERE student_id = ?
                ORDER BY borrow_date DESC
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {

            ps.setInt(1, studentId);

            try (ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    list.add(new BorrowRecord(
                            rs.getInt("id"),
                            rs.getInt("student_id"),
                            rs.getInt("book_id"),
                            rs.getString("borrow_date"),
                            rs.getString("due_date"),
                            rs.getString("return_date"),
                            rs.getBoolean("returned")
                    ));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public List<BorrowRecord> getOverdueBooks() {

        List<BorrowRecord> list = new ArrayList<>();

        String sql = """
                SELECT *
                FROM borrow_records
                WHERE returned = 0
                AND due_date < date('now')
                ORDER BY due_date
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)
        ) {

            while (rs.next()) {

                list.add(new BorrowRecord(
                        rs.getInt("id"),
                        rs.getInt("student_id"),
                        rs.getInt("book_id"),
                        rs.getString("borrow_date"),
                        rs.getString("due_date"),
                        rs.getString("return_date"),
                        rs.getBoolean("returned")
                ));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }
}