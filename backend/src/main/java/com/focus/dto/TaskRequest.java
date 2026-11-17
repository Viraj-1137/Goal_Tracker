package com.focus.dto;

import com.focus.model.enums.Priority;
import com.focus.model.enums.TaskStatus;
import java.time.LocalDate;

public class TaskRequest {
    private String title;
    private String description;
    private TaskStatus status = TaskStatus.TODO;
    private Priority priority = Priority.MEDIUM;
    private LocalDate dueDate;
    private Long weeklyGoalId;
    private Double position;

    public TaskRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getWeeklyGoalId() {
        return weeklyGoalId;
    }

    public void setWeeklyGoalId(Long weeklyGoalId) {
        this.weeklyGoalId = weeklyGoalId;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}
