package com.library.backend.controller;

import com.library.backend.dto.AdminStatistics;
import com.library.backend.service.AdminService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/statistics")
    public AdminStatistics getStatistics() {
        return adminService.getStatistics();
    }
}
