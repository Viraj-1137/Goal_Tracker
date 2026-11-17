package com.focus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.focus.model.enums.GoalStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weekly_goals")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WeeklyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "yearly_goal_id", nullable = true)
    @JsonIgnore
    private YearlyGoal yearlyGoal;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "week_start_date")
    private LocalDate weekStartDate;

    @Column(name = "week_end_date")
    private LocalDate weekEndDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalStatus status = GoalStatus.TODO;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;

    @Column(nullable = false)
    private boolean archived = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "weeklyGoal", cascade = CascadeType.ALL, orphanRemoval = false, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Task> tasks = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public WeeklyGoal() {}

    // Breadcrumb and convenience getters
    public Long getYearlyGoalId() {
        return yearlyGoal != null ? yearlyGoal.getId() : null;
    }

    public String getYearlyGoalTitle() {
        return yearlyGoal != null ? yearlyGoal.getTitle() : null;
    }

    public Long getVisionId() {
        return (yearlyGoal != null && yearlyGoal.getVision() != null) ? yearlyGoal.getVision().getId() : null;
    }

    public String getVisionTitle() {
        return (yearlyGoal != null && yearlyGoal.getVision() != null) ? yearlyGoal.getVision().getTitle() : null;
    }

    public String getVisionColor() {
        return (yearlyGoal != null && yearlyGoal.getVision() != null) ? yearlyGoal.getVision().getColor() : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public YearlyGoal getYearlyGoal() {
        return yearlyGoal;
    }

    public void setYearlyGoal(YearlyGoal yearlyGoal) {
        this.yearlyGoal = yearlyGoal;
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

    public LocalDate getWeekStartDate() {
        return weekStartDate;
    }

    public void setWeekStartDate(LocalDate weekStartDate) {
        this.weekStartDate = weekStartDate;
    }

    public LocalDate getWeekEndDate() {
        return weekEndDate;
    }

    public void setWeekEndDate(LocalDate weekEndDate) {
        this.weekEndDate = weekEndDate;
    }

    public GoalStatus getStatus() {
        return status;
    }

    public void setStatus(GoalStatus status) {
        this.status = status;
        if (status == GoalStatus.DONE && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        } else if (status != GoalStatus.DONE) {
            this.completedAt = null;
        }
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
