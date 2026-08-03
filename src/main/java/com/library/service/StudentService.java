package com.library.service;

import java.util.Scanner;

import com.library.model.Student;

public class StudentService {

    private final Scanner scanner = new Scanner(System.in);

    private final BookService bookService = new BookService();
    private final BorrowService borrowService = new BorrowService();

    public void dashboard(Student student) {

        while (true) {

            System.out.println("\n======================================");
            System.out.println("         STUDENT DASHBOARD");
            System.out.println("======================================");
            System.out.println("Welcome : " + student.getFullName());
            System.out.println("--------------------------------------");
            System.out.println("1. View Available Books");
            System.out.println("2. Search Book");
            System.out.println("3. Borrow Book");
            System.out.println("4. Return Book");
            System.out.println("5. My Borrow History");
            System.out.println("6. Logout");
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

                    bookService.displayAvailableBooks();

                    break;

                case 2:

                    System.out.print("Book Title : ");

                    bookService.searchBook(scanner.nextLine());

                    break;

                case 3:

                    System.out.print("Book ID : ");

                    int borrowId =
                            Integer.parseInt(scanner.nextLine());

                    borrowService.borrowBook(
                            student.getId(),
                            borrowId);

                    break;

                case 4:

                    System.out.print("Book ID : ");

                    int returnId =
                            Integer.parseInt(scanner.nextLine());

                    borrowService.returnBook(returnId);

                    break;

                case 5:

                    borrowService.showStudentHistory(
                            student.getId());

                    break;

                case 6:

                    System.out.println("\nLogged Out Successfully.");

                    return;

                default:

                    System.out.println("Invalid Choice.");

            }

        }

    }

}