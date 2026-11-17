package com.focus.controller;

import com.focus.dto.ReportsDTO;
import com.focus.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/retrospective")
    public ResponseEntity<ReportsDTO> getYearlyRetrospective(@RequestParam(value = "year", required = false) Integer year) {
        return ResponseEntity.ok(reportService.getYearlyRetrospective(year));
    }
}
