package com.focus.controller;

import com.focus.dto.RitualLogRequest;
import com.focus.dto.RitualRequest;
import com.focus.model.Ritual;
import com.focus.model.RitualLog;
import com.focus.service.RitualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rituals")
@CrossOrigin(origins = "*")
public class RitualController {

    @Autowired
    private RitualService ritualService;

    @GetMapping
    public ResponseEntity<List<Ritual>> getAllRituals() {
        return ResponseEntity.ok(ritualService.getAllActiveRituals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ritual> getRitualById(@PathVariable Long id) {
        return ResponseEntity.ok(ritualService.getRitualById(id));
    }

    @PostMapping
    public ResponseEntity<Ritual> createRitual(@RequestBody RitualRequest request) {
        return ResponseEntity.ok(ritualService.createRitual(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ritual> updateRitual(@PathVariable Long id, @RequestBody RitualRequest request) {
        return ResponseEntity.ok(ritualService.updateRitual(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveRitual(@PathVariable Long id) {
        ritualService.archiveRitual(id);
        return ResponseEntity.ok(Map.of("message", "Ritual archived successfully", "id", id));
    }

    /**
     * One-click toggle for habit completion
     */
    @PostMapping("/{id}/toggle")
    public ResponseEntity<RitualLog> toggleRitual(
            @PathVariable Long id,
            @RequestBody(required = false) RitualLogRequest request) {
        LocalDate date = (request != null && request.getDate() != null) ? request.getDate() : LocalDate.now();
        Boolean completed = (request != null) ? request.getCompleted() : null;
        String notes = (request != null) ? request.getNotes() : null;
        return ResponseEntity.ok(ritualService.toggleRitualCompletion(id, date, completed, notes));
    }

    /**
     * GitHub-style contribution heatmap
     */
    @GetMapping("/heatmap")
    public ResponseEntity<Map<String, Integer>> getContributionHeatmap(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        LocalDate start = (startDate != null) ? startDate : end.minusDays(180); // default last ~6 months
        return ResponseEntity.ok(ritualService.getContributionHeatmap(start, end));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<Map<LocalDate, Boolean>> getRitualLogs(
            @PathVariable Long id,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        LocalDate start = (startDate != null) ? startDate : end.minusDays(30);
        return ResponseEntity.ok(ritualService.getRitualLogsForDateRange(id, start, end));
    }
}
