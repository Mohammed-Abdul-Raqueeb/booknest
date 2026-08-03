package com.library.repository;

import com.library.config.DatabaseConnection;
import com.library.model.Book;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookRepository {

    public boolean addBook(Book book) {

        String sql = """
                INSERT INTO books(id,title,author,category,isbn,available)
                VALUES(?,?,?,?,?,?)
                """;

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, book.getId());
            ps.setString(2, book.getTitle());
            ps.setString(3, book.getAuthor());
            ps.setString(4, book.getCategory());
            ps.setString(5, book.getIsbn());
            ps.setBoolean(6, book.isAvailable());

            ps.executeUpdate();

            return true;

        } catch (SQLException e) {

            return false;

        }

    }


    public List<Book> getAllBooks() {

        List<Book> books = new ArrayList<>();

        String sql = "SELECT * FROM books";

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {


            while (rs.next()) {

                books.add(new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getString("category"),
                        rs.getString("isbn"),
                        rs.getBoolean("available")));

            }

        } catch (SQLException e) {

            e.printStackTrace();

        }

        return books;

    }


    public Book findBookById(int id) {

        String sql = "SELECT * FROM books WHERE id=?";

        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {


            ps.setInt(1, id);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                return new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getString("category"),
                        rs.getString("isbn"),
                        rs.getBoolean("available"));

            }

        } catch (SQLException e) {

            e.printStackTrace();

        }

        return null;

    }


    public Book searchBookByTitle(String title) {

        return searchBook(
                "title",
                title);

    }


    public Book searchBookByAuthor(String author) {

        return searchBook(
                "author",
                author);

    }


    public Book searchBookByCategory(String category) {

        return searchBook(
                "category",
                category);

    }


    public Book searchBookByISBN(String isbn) {

        return searchBook(
                "isbn",
                isbn);

    }


    private Book searchBook(String column, String value) {

        String sql = "SELECT * FROM books WHERE LOWER(" + column + ")=LOWER(?)";


        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {


            ps.setString(1, value);

            ResultSet rs = ps.executeQuery();


            if (rs.next()) {

                return new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getString("category"),
                        rs.getString("isbn"),
                        rs.getBoolean("available"));

            }


        } catch (SQLException e) {

            e.printStackTrace();

        }


        return null;

    }


    public boolean updateBook(Book book) {

        String sql = """
                UPDATE books
                SET title=?,author=?,category=?,isbn=?,available=?
                WHERE id=?
                """;


        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {


            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setString(3, book.getCategory());
            ps.setString(4, book.getIsbn());
            ps.setBoolean(5, book.isAvailable());
            ps.setInt(6, book.getId());


            return ps.executeUpdate() > 0;


        } catch (SQLException e) {

            return false;

        }

    }


    public boolean updateAvailability(int id, boolean available) {

        String sql = "UPDATE books SET available=? WHERE id=?";


        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {


            ps.setBoolean(1, available);
            ps.setInt(2, id);


            return ps.executeUpdate() > 0;


        } catch (SQLException e) {

            return false;

        }

    }


    public boolean deleteBook(int id) {

        String sql = "DELETE FROM books WHERE id=?";


        try (
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {


            ps.setInt(1, id);


            return ps.executeUpdate() > 0;


        } catch (SQLException e) {

            return false;

        }

    }


    public int getTotalBooks() {

        String sql = "SELECT COUNT(*) FROM books";

        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {


            return rs.getInt(1);


        } catch (SQLException e) {

            return 0;

        }

    }


    public int getAvailableBooks() {

        String sql = "SELECT COUNT(*) FROM books WHERE available=1";


        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {


            return rs.getInt(1);


        } catch (SQLException e) {

            return 0;

        }

    }


    public int getBorrowedBooks() {

        String sql = "SELECT COUNT(*) FROM books WHERE available=0";


        try (
                Connection conn = DatabaseConnection.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {


            return rs.getInt(1);


        } catch (SQLException e) {

            return 0;

        }

    }
public List<Book> getAvailableBooksList() {

    List<Book> books = new ArrayList<>();

    String sql = "SELECT * FROM books WHERE available=1";

    try (
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)) {


        while (rs.next()) {

            books.add(new Book(
                    rs.getInt("id"),
                    rs.getString("title"),
                    rs.getString("author"),
                    rs.getString("category"),
                    rs.getString("isbn"),
                    rs.getBoolean("available")));

        }


    } catch (SQLException e) {

        e.printStackTrace();

    }


    return books;

}
}