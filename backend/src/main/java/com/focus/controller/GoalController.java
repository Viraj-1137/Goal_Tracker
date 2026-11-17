package com.focus.controller;

import com.focus.dto.CloseSprintRequest;
import com.focus.dto.WeeklyGoalRequest;
import com.focus.dto.YearlyGoalRequest;
import com.focus.model.WeeklyGoal;
import com.focus.model.YearlyGoal;
import com.focus.model.enums.GoalStatus;
import com.focus.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // --- Yearly Goals ---

    @GetMapping("/yearly-goals")
    public ResponseEntity<List<YearlyGoal>> getYearlyGoals(
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "visionId", required = false) Long visionId) {
        if (year != null) {
            return ResponseEntity.ok(goalService.getYearlyGoalsByYear(year));
        }
        if (visionId != null) {
            return ResponseEntity.ok(goalService.getYearlyGoalsByVision(visionId));
        }
        return ResponseEntity.ok(goalService.getAllActiveYearlyGoals());
    }

    @GetMapping("/yearly-goals/{id}")
    public ResponseEntity<YearlyGoal> getYearlyGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getYearlyGoalById(id));
    }

    @PostMapping("/yearly-goals")
    public ResponseEntity<YearlyGoal> createYearlyGoal(@RequestBody YearlyGoalRequest request) {
        return ResponseEntity.ok(goalService.createYearlyGoal(request));
    }

    @PutMapping("/yearly-goals/{id}")
    public ResponseEntity<YearlyGoal> updateYearlyGoal(@PathVariable Long id, @RequestBody YearlyGoalRequest request) {
        return ResponseEntity.ok(goalService.updateYearlyGoal(id, request));
    }

    @PatchMapping("/yearly-goals/{id}/status")
    public ResponseEntity<YearlyGoal> updateYearlyGoalStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        GoalStatus status = GoalStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(goalService.updateYearlyGoalStatus(id, status));
    }

    @DeleteMapping("/yearly-goals/{id}")
    public ResponseEntity<?> archiveYearlyGoal(@PathVariable Long id) {
        goalService.archiveYearlyGoal(id);
        return ResponseEntity.ok(Map.of("message", "Yearly goal archived successfully", "id", id));
    }

    // --- Weekly Goals (Sprints) ---

    @GetMapping("/weekly-goals")
    public ResponseEntity<List<WeeklyGoal>> getWeeklyGoals(
            @RequestParam(value = "yearlyGoalId", required = false) Long yearlyGoalId) {
        if (yearlyGoalId != null) {
            return ResponseEntity.ok(goalService.getWeeklyGoalsByYearlyGoal(yearlyGoalId));
        }
        return ResponseEntity.ok(goalService.getAllActiveWeeklyGoals());
    }

    @GetMapping("/weekly-goals/active")
    public ResponseEntity<WeeklyGoal> getActiveSprint() {
        return goalService.getActiveSprint()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/weekly-goals/{id}")
    public ResponseEntity<WeeklyGoal> getWeeklyGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getWeeklyGoalById(id));
    }

    @PostMapping("/weekly-goals")
    public ResponseEntity<WeeklyGoal> createWeeklyGoal(@RequestBody WeeklyGoalRequest request) {
        return ResponseEntity.ok(goalService.createWeeklyGoal(request));
    }

    @PutMapping("/weekly-goals/{id}")
    public ResponseEntity<WeeklyGoal> updateWeeklyGoal(@PathVariable Long id, @RequestBody WeeklyGoalRequest request) {
        return ResponseEntity.ok(goalService.updateWeeklyGoal(id, request));
    }

    @PatchMapping("/weekly-goals/{id}/status")
    public ResponseEntity<WeeklyGoal> updateWeeklyGoalStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        GoalStatus status = GoalStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(goalService.updateWeeklyGoalStatus(id, status));
    }

    @PostMapping("/weekly-goals/{id}/activate")
    public ResponseEntity<WeeklyGoal> activateSprint(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.setActiveSprint(id));
    }

    @PostMapping("/weekly-goals/{id}/close")
    public ResponseEntity<WeeklyGoal> closeSprint(@PathVariable Long id, @RequestBody(required = false) CloseSprintRequest request) {
        return ResponseEntity.ok(goalService.closeSprint(id, request));
    }

    @DeleteMapping("/weekly-goals/{id}")
    public ResponseEntity<?> archiveWeeklyGoal(@PathVariable Long id) {
        goalService.archiveWeeklyGoal(id);
        return ResponseEntity.ok(Map.of("message", "Weekly goal archived successfully", "id", id));
    }
}
