package com.library.service;

import java.util.List;
import java.util.Scanner;

import com.library.model.Student;
import com.library.repository.StudentRepository;

public class AdminService {

    private final Scanner scanner = new Scanner(System.in);

    private final BookService bookService = new BookService();
    private final BorrowService borrowService = new BorrowService();
    private final StudentRepository studentRepository = new StudentRepository();


    public void dashboard() {

        while (true) {

            System.out.println("\n======================================");
            System.out.println("          ADMIN DASHBOARD");
            System.out.println("======================================");
            System.out.println("1. Add Book");
            System.out.println("2. View Books");
            System.out.println("3. Search Book");
            System.out.println("4. Update Book");
            System.out.println("5. Delete Book");
            System.out.println("6. Borrow Book");
            System.out.println("7. Return Book");
            System.out.println("8. Borrow History");
            System.out.println("9. Dashboard Statistics");
            System.out.println("10. View Students");
            System.out.println("11. Overdue Books");
            System.out.println("12. Logout");
            System.out.println("======================================");
            System.out.print("Enter Choice : ");


            int choice;

            try {

                choice = Integer.parseInt(scanner.nextLine());

            } catch (Exception e) {

                System.out.println("Invalid Choice.");
                continue;

            }


            switch (choice) {


                case 1:

                    System.out.print("Book ID : ");
                    int id = Integer.parseInt(scanner.nextLine());

                    System.out.print("Title : ");
                    String title = scanner.nextLine();

                    System.out.print("Author : ");
                    String author = scanner.nextLine();

                    System.out.print("Category : ");
                    String category = scanner.nextLine();

                    System.out.print("ISBN : ");
                    String isbn = scanner.nextLine();

                    bookService.addBook(id, title, author, category, isbn);

                    break;


                case 2:

                    bookService.displayBooks();

                    break;


                case 3:

                    System.out.println("\n========= SEARCH BOOK =========");
                    System.out.println("1. Search By Title");
                    System.out.println("2. Search By Author");
                    System.out.println("3. Search By Category");
                    System.out.println("4. Search By ISBN");

                    System.out.print("Choice : ");

                    int searchChoice =
                            Integer.parseInt(scanner.nextLine());


                    switch (searchChoice) {

                        case 1:

                            System.out.print("Title : ");
                            bookService.searchBookByTitle(scanner.nextLine());
                            break;


                        case 2:

                            System.out.print("Author : ");
                            bookService.searchBookByAuthor(scanner.nextLine());
                            break;


                        case 3:

                            System.out.print("Category : ");
                            bookService.searchBookByCategory(scanner.nextLine());
                            break;


                        case 4:

                            System.out.print("ISBN : ");
                            bookService.searchBookByISBN(scanner.nextLine());
                            break;


                        default:

                            System.out.println("Invalid Search Choice.");

                    }

                    break;


                case 4:

                    System.out.print("Book ID : ");
                    int updateId = Integer.parseInt(scanner.nextLine());

                    System.out.print("New Title : ");
                    String newTitle = scanner.nextLine();

                    System.out.print("New Author : ");
                    String newAuthor = scanner.nextLine();

                    System.out.print("New Category : ");
                    String newCategory = scanner.nextLine();

                    System.out.print("New ISBN : ");
                    String newIsbn = scanner.nextLine();

                    bookService.updateBook(
                            updateId,
                            newTitle,
                            newAuthor,
                            newCategory,
                            newIsbn);

                    break;


                case 5:

                    System.out.print("Book ID : ");

                    bookService.deleteBook(
                            Integer.parseInt(scanner.nextLine()));

                    break;


                case 6:

                    System.out.print("Student ID : ");
                    int studentId = Integer.parseInt(scanner.nextLine());

                    System.out.print("Book ID : ");
                    int bookId = Integer.parseInt(scanner.nextLine());

                    borrowService.borrowBook(studentId, bookId);

                    break;


                case 7:

                    System.out.print("Book ID : ");

                    borrowService.returnBook(
                            Integer.parseInt(scanner.nextLine()));

                    break;


                case 8:

                    borrowService.showBorrowHistory();

                    break;


                case 9:

                    System.out.println("\n========== DASHBOARD ==========");
                    System.out.println("Total Books      : " + bookService.getTotalBooks());
                    System.out.println("Available Books  : " + bookService.getAvailableBooks());
                    System.out.println("Borrowed Books   : " + bookService.getBorrowedBooks());
                    System.out.println("Total Students   : " + studentRepository.getTotalStudents());
                    System.out.println("===============================");

                    break;


                case 10:

                    viewStudents();

                    break;


                case 11:

                    borrowService.showOverdueBooks();

                    break;


                case 12:

                    System.out.println("\nLogged Out Successfully.");
                    return;


                default:

                    System.out.println("Invalid Choice.");

            }

        }

    }


    private void viewStudents() {

        List<Student> students = studentRepository.getAllStudents();


        if (students.isEmpty()) {

            System.out.println("\nNo Students Found.");
            return;

        }


        System.out.println("\n============= STUDENTS =============");


        for (Student s : students) {

            System.out.println("ID       : " + s.getId());
            System.out.println("Name     : " + s.getFullName());
            System.out.println("Username : " + s.getUsername());
            System.out.println("Email    : " + s.getEmail());
            System.out.println("------------------------------------");

        }

    }

}