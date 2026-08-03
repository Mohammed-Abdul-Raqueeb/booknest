package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;

import java.util.List;

public class BookService {

    private final BookRepository repository = new BookRepository();


    public void addBook(int id,
                        String title,
                        String author,
                        String category,
                        String isbn) {

        Book book = new Book(id, title, author, category, isbn, true);

        if (repository.addBook(book)) {

            System.out.println("\n✅ Book Added Successfully.");

        } else {

            System.out.println("\n❌ Book ID or ISBN already exists.");

        }

    }


    public void displayBooks() {

        List<Book> books = repository.getAllBooks();

        if (books.isEmpty()) {

            System.out.println("\nNo Books Available.");
            return;

        }


        System.out.println("\n============== BOOK LIST ==============\n");


        for (Book book : books) {

            printBook(book);

        }

    }


    public void searchBookByTitle(String title) {

        Book book = repository.searchBookByTitle(title);

        displaySearchResult(book);

    }


    public void searchBookByAuthor(String author) {

        Book book = repository.searchBookByAuthor(author);

        displaySearchResult(book);

    }


    public void searchBookByCategory(String category) {

        Book book = repository.searchBookByCategory(category);

        displaySearchResult(book);

    }


    public void searchBookByISBN(String isbn) {

        Book book = repository.searchBookByISBN(isbn);

        displaySearchResult(book);

    }


    private void displaySearchResult(Book book) {

        if (book == null) {

            System.out.println("\n❌ Book Not Found.");
            return;

        }


        System.out.println("\n========== BOOK FOUND ==========");

        printBook(book);

    }


    private void printBook(Book book) {

        System.out.println("ID        : " + book.getId());
        System.out.println("Title     : " + book.getTitle());
        System.out.println("Author    : " + book.getAuthor());
        System.out.println("Category  : " + book.getCategory());
        System.out.println("ISBN      : " + book.getIsbn());
        System.out.println("Available : " + (book.isAvailable() ? "Yes" : "No"));
        System.out.println("---------------------------------------");

    }


    public void updateBook(int id,
                           String title,
                           String author,
                           String category,
                           String isbn) {


        Book book = repository.findBookById(id);


        if (book == null) {

            System.out.println("\n❌ Book Not Found.");
            return;

        }


        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setIsbn(isbn);


        if (repository.updateBook(book)) {

            System.out.println("\n✅ Book Updated Successfully.");

        } else {

            System.out.println("\n❌ Update Failed.");

        }

    }


    public void deleteBook(int id) {

        if (repository.deleteBook(id)) {

            System.out.println("\n✅ Book Deleted Successfully.");

        } else {

            System.out.println("\n❌ Book Not Found.");

        }

    }


    public void changeAvailability(int id, boolean available) {

        repository.updateAvailability(id, available);

    }


    public int getTotalBooks() {

        return repository.getTotalBooks();

    }


    public int getAvailableBooks() {

        return repository.getAvailableBooks();

    }


    public int getBorrowedBooks() {

        return repository.getBorrowedBooks();

    }
public void searchBook(String title) {

    searchBookByTitle(title);

}
public void displayAvailableBooks() {

    List<Book> books = repository.getAvailableBooksList();

    if (books.isEmpty()) {

        System.out.println("\nNo Available Books.");
        return;

    }


    System.out.println("\n========= AVAILABLE BOOKS =========");


    for (Book book : books) {

        System.out.println("ID        : " + book.getId());
        System.out.println("Title     : " + book.getTitle());
        System.out.println("Author    : " + book.getAuthor());
        System.out.println("Category  : " + book.getCategory());
        System.out.println("ISBN      : " + book.getIsbn());
        System.out.println("-----------------------------------");

    }

}
}