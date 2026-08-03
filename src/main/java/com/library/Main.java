package com.library;

import java.util.Scanner;

import com.library.config.DatabaseConnection;
import com.library.menu.MainMenu;
import com.library.service.AdminService;
import com.library.service.AuthenticationService;

public class Main {

    public static void main(String[] args) {

        DatabaseConnection.initializeDatabase();

        Scanner scanner = new Scanner(System.in);

        MainMenu menu = new MainMenu();
        AuthenticationService auth = new AuthenticationService();
        AdminService adminService = new AdminService();

        while (true) {

            menu.display();

            System.out.print("Enter your choice: ");

            int choice;

            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (Exception e) {
                System.out.println("Invalid Choice.");
                continue;
            }

            switch (choice) {

                case 1:

                    System.out.println("\n========= ADMIN LOGIN =========");

                    System.out.print("Username : ");
                    String adminUsername = scanner.nextLine();

                    System.out.print("Password : ");
                    String adminPassword = scanner.nextLine();

                    if (adminUsername.equals("admin") && adminPassword.equals("admin123")) {

                        System.out.println("\n✅ Login Successful.");

                        adminService.dashboard();

                    } else {

                        System.out.println("\n❌ Invalid Admin Credentials.");

                    }

                    break;

                case 2:

                    System.out.println("\n========= STUDENT LOGIN =========");

                    System.out.print("Username : ");
                    String username = scanner.nextLine();

                    System.out.print("Password : ");
                    String password = scanner.nextLine();

                    auth.loginStudent(username, password);

                    break;

                case 3:

                    System.out.println("\n========= STUDENT SIGNUP =========");

                    System.out.print("Full Name : ");
                    String fullName = scanner.nextLine();

                    System.out.print("Username : ");
                    String newUsername = scanner.nextLine();

                    System.out.print("Email : ");
                    String email = scanner.nextLine();

                    System.out.print("Password : ");
                    String newPassword = scanner.nextLine();

                    System.out.print("Confirm Password : ");
                    String confirmPassword = scanner.nextLine();

                    auth.registerStudent(
                            fullName,
                            newUsername,
                            email,
                            newPassword,
                            confirmPassword);

                    break;

                case 4:

                    System.out.println("\nThank you for using Library Management System.");
                    scanner.close();
                    System.exit(0);
                    break;

                default:

                    System.out.println("\n❌ Invalid Choice.");

            }

        }

    }

}