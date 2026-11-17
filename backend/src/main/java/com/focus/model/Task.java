package com.focus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.focus.model.enums.Priority;
import com.focus.model.enums.TaskStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_goal_id", nullable = true)
    @JsonIgnore
    private WeeklyGoal weeklyGoal;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "position")
    private Double position = 0.0;

    @Column(nullable = false)
    private boolean archived = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Attachment> attachments = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (position == null) {
            position = 0.0;
        }
    }

    public Task() {}

    // Breadcrumb getters
    public Long getWeeklyGoalId() {
        return weeklyGoal != null ? weeklyGoal.getId() : null;
    }

    public String getWeeklyGoalTitle() {
        return weeklyGoal != null ? weeklyGoal.getTitle() : null;
    }

    public Long getYearlyGoalId() {
        return (weeklyGoal != null && weeklyGoal.getYearlyGoal() != null)
                ? weeklyGoal.getYearlyGoal().getId()
                : null;
    }

    public String getYearlyGoalTitle() {
        return (weeklyGoal != null && weeklyGoal.getYearlyGoal() != null)
                ? weeklyGoal.getYearlyGoal().getTitle()
                : null;
    }

    public Long getVisionId() {
        if (weeklyGoal != null && weeklyGoal.getYearlyGoal() != null && weeklyGoal.getYearlyGoal().getVision() != null) {
            return weeklyGoal.getYearlyGoal().getVision().getId();
        }
        return null;
    }

    public String getVisionTitle() {
        if (weeklyGoal != null && weeklyGoal.getYearlyGoal() != null && weeklyGoal.getYearlyGoal().getVision() != null) {
            return weeklyGoal.getYearlyGoal().getVision().getTitle();
        }
        return null;
    }

    public String getVisionColor() {
        if (weeklyGoal != null && weeklyGoal.getYearlyGoal() != null && weeklyGoal.getYearlyGoal().getVision() != null) {
            return weeklyGoal.getYearlyGoal().getVision().getColor();
        }
        return null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WeeklyGoal getWeeklyGoal() {
        return weeklyGoal;
    }

    public void setWeeklyGoal(WeeklyGoal weeklyGoal) {
        this.weeklyGoal = weeklyGoal;
    }

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
        if (status == TaskStatus.DONE && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        } else if (status != TaskStatus.DONE) {
            this.completedAt = null;
        }
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

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }
}
