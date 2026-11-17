package com.focus.service;

import com.focus.dto.TaskRequest;
import com.focus.model.Attachment;
import com.focus.model.Task;
import com.focus.model.WeeklyGoal;
import com.focus.model.enums.AttachmentType;
import com.focus.model.enums.Priority;
import com.focus.model.enums.TaskStatus;
import com.focus.repository.AttachmentRepository;
import com.focus.repository.TaskRepository;
import com.focus.repository.WeeklyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private WeeklyGoalRepository weeklyGoalRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    public List<Task> getAllActiveTasks() {
        return taskRepository.findByArchivedFalseOrderByPositionAscCreatedAtDesc();
    }

    public List<Task> getTasksByWeeklyGoal(Long weeklyGoalId) {
        return taskRepository.findByWeeklyGoalIdAndArchivedFalseOrderByPositionAscCreatedAtDesc(weeklyGoalId);
    }

    public List<Task> getTodayTasks() {
        return taskRepository.findTasksForToday(LocalDate.now());
    }

    public List<Task> searchTasks(TaskStatus status, Priority priority, Long weeklyGoalId) {
        return taskRepository.searchTasks(status, priority, weeklyGoalId);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }

    public Task createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setPosition(request.getPosition() != null ? request.getPosition() : System.currentTimeMillis() / 1000.0);

        if (request.getWeeklyGoalId() != null) {
            WeeklyGoal weeklyGoal = weeklyGoalRepository.findById(request.getWeeklyGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("Weekly Goal not found: " + request.getWeeklyGoalId()));
            task.setWeeklyGoal(weeklyGoal);
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id);
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getPosition() != null) task.setPosition(request.getPosition());

        if (request.getWeeklyGoalId() != null) {
            WeeklyGoal weeklyGoal = weeklyGoalRepository.findById(request.getWeeklyGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("Weekly Goal not found: " + request.getWeeklyGoalId()));
            task.setWeeklyGoal(weeklyGoal);
        } else if (request.getWeeklyGoalId() == null && request.getStatus() == TaskStatus.BACKLOG) {
            task.setWeeklyGoal(null);
        }

        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, TaskStatus status) {
        Task task = getTaskById(id);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public Task updatePositionAndStatus(Long id, TaskStatus status, Double position) {
        Task task = getTaskById(id);
        if (status != null) {
            task.setStatus(status);
        }
        if (position != null) {
            task.setPosition(position);
        }
        return taskRepository.save(task);
    }

    public void archiveTask(Long id) {
        Task task = getTaskById(id);
        task.setArchived(true);
        taskRepository.save(task);
    }

    // Attachments
    public Attachment addAttachment(Long taskId, AttachmentType type, String urlOrPath, String label) {
        Task task = getTaskById(taskId);
        Attachment attachment = new Attachment(task, type, urlOrPath, label);
        return attachmentRepository.save(attachment);
    }

    public void deleteAttachment(Long attachmentId) {
        attachmentRepository.deleteById(attachmentId);
    }

    public List<Attachment> getAttachments(Long taskId) {
        return attachmentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }
}
