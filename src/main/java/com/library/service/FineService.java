package com.library.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class FineService {

    private static final int FINE_PER_DAY = 10;

    public int calculateFine(String dueDate, String returnDate) {

        LocalDate due = LocalDate.parse(dueDate);
        LocalDate returned = LocalDate.parse(returnDate);

        long lateDays = ChronoUnit.DAYS.between(due, returned);

        if (lateDays <= 0) {
            return 0;
        }

        return (int) lateDays * FINE_PER_DAY;
    }

}