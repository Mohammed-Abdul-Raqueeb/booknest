# Library Management System

A Java-based Library Management System built using Java, JDBC, Maven, and SQLite.

## Features

## Admin Features

- Admin Login
- Add Books
- View All Books
- Search Books
  - Search by Title
  - Search by Author
  - Search by Category
  - Search by ISBN
- Update Books
- Delete Books
- Borrow Books
- Return Books
- View Borrow History
- Dashboard Statistics
- View Registered Students
- View Overdue Books
- Automatic Fine Calculation

## Student Features

- Student Registration
- Student Login
- View Available Books
- Search Books
- Borrow Books
- Return Books
- View Borrow History

---

## Technologies Used

- Java
- JDBC
- SQLite Database
- Maven
- Object-Oriented Programming (OOP)

---

## Project Structure

```
src/main/java/com/library

├── config
│   └── DatabaseConnection.java
│
├── model
│   ├── Book.java
│   ├── Student.java
│   └── BorrowRecord.java
│
├── repository
│   ├── BookRepository.java
│   ├── StudentRepository.java
│   └── BorrowRepository.java
│
├── service
│   ├── AdminService.java
│   ├── StudentService.java
│   ├── BookService.java
│   ├── BorrowService.java
│   └── FineService.java
│
└── Main.java
```

---

## Database

The system uses SQLite database.

### Books Table

Stores:

- Book ID
- Title
- Author
- Category
- ISBN
- Availability Status


### Students Table

Stores:

- Student ID
- Full Name
- Username
- Email
- Password


### Borrow Records Table

Stores:

- Student ID
- Book ID
- Borrow Date
- Due Date
- Return Date
- Return Status

---

## Fine Calculation

- Borrow period: 14 days
- Fine: ₹10 per late day

Example:

```
Late Days : 3
Fine      : ₹30
```

---

## How To Run

### Requirements

- Java 17 or above
- Maven

### Compile Project

```
mvn clean compile
```

### Run Project

```
mvn exec:java
```

---

## Future Improvements

- GUI Application
- Web Version
- Email Notifications
- Online Database
- Advanced User Roles

---

## Author

Library Management System Project