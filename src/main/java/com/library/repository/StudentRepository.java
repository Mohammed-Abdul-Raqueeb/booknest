package com.library.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.library.config.DatabaseConnection;
import com.library.model.Student;

public class StudentRepository {

    public boolean addStudent(Student student) {

        String sql = """
                INSERT INTO students(full_name,username,email,password)
                VALUES(?,?,?,?)
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, student.getFullName());
            ps.setString(2, student.getUsername());
            ps.setString(3, student.getEmail());
            ps.setString(4, student.getPassword());

            ps.executeUpdate();

            return true;

        } catch (SQLException e) {

            return false;

        }

    }

    public Student login(String username, String password) {

        String sql = """
                SELECT * FROM students
                WHERE username=? AND password=?
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                return new Student(
                        rs.getInt("id"),
                        rs.getString("full_name"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"));

            }

        } catch (SQLException e) {

            e.printStackTrace();

        }

        return null;

    }

    public int getTotalStudents() {

        String sql = "SELECT COUNT(*) FROM students";

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            return rs.getInt(1);

        } catch (SQLException e) {

            return 0;

        }

    }

    public List<Student> getAllStudents() {

        List<Student> students = new ArrayList<>();

        String sql = "SELECT * FROM students";

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {

                students.add(new Student(
                        rs.getInt("id"),
                        rs.getString("full_name"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")));

            }

        } catch (SQLException e) {

            e.printStackTrace();

        }

        return students;

    }

}