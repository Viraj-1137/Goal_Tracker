package com.focus.controller;

import com.focus.dto.PositionUpdateRequest;
import com.focus.dto.StatusUpdateRequest;
import com.focus.dto.TaskRequest;
import com.focus.model.Attachment;
import com.focus.model.Task;
import com.focus.model.enums.AttachmentType;
import com.focus.model.enums.Priority;
import com.focus.model.enums.TaskStatus;
import com.focus.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(value = "status", required = false) TaskStatus status,
            @RequestParam(value = "priority", required = false) Priority priority,
            @RequestParam(value = "weeklyGoalId", required = false) Long weeklyGoalId) {
        if (status != null || priority != null || weeklyGoalId != null) {
            return ResponseEntity.ok(taskService.searchTasks(status, priority, weeklyGoalId));
        }
        return ResponseEntity.ok(taskService.getAllActiveTasks());
    }

    @GetMapping("/today")
    public ResponseEntity<List<Task>> getTodayTasks() {
        return ResponseEntity.ok(taskService.getTodayTasks());
    }

    @GetMapping("/sprint/{weeklyGoalId}")
    public ResponseEntity<List<Task>> getTasksBySprint(@PathVariable Long weeklyGoalId) {
        return ResponseEntity.ok(taskService.getTasksByWeeklyGoal(weeklyGoalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    /**
     * Single-click status update without form submission
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        if (request.getPosition() != null) {
            return ResponseEntity.ok(taskService.updatePositionAndStatus(id, request.getStatus(), request.getPosition()));
        }
        return ResponseEntity.ok(taskService.updateStatus(id, request.getStatus()));
    }

    /**
     * Drag-and-drop position & status update
     */
    @PatchMapping("/{id}/position")
    public ResponseEntity<Task> updatePosition(@PathVariable Long id, @RequestBody PositionUpdateRequest request) {
        return ResponseEntity.ok(taskService.updatePositionAndStatus(id, request.getStatus(), request.getPosition()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveTask(@PathVariable Long id) {
        taskService.archiveTask(id);
        return ResponseEntity.ok(Map.of("message", "Task archived successfully", "id", id));
    }

    // Attachments
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<Attachment>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getAttachments(id));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<Attachment> addAttachment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        AttachmentType type = AttachmentType.valueOf(body.getOrDefault("type", "FILE"));
        String urlOrPath = body.get("urlOrPath");
        String label = body.get("label");
        return ResponseEntity.ok(taskService.addAttachment(id, type, urlOrPath, label));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long attachmentId) {
        taskService.deleteAttachment(attachmentId);
        return ResponseEntity.ok(Map.of("message", "Attachment removed", "id", attachmentId));
    }
}
