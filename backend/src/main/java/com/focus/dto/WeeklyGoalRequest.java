package com.focus.dto;

import com.focus.model.enums.GoalStatus;
import java.time.LocalDate;

public class WeeklyGoalRequest {
    private Long yearlyGoalId;
    private String title;
    private String description;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private GoalStatus status = GoalStatus.TODO;
    private Boolean isActive = false;

    public WeeklyGoalRequest() {}

    public Long getYearlyGoalId() {
        return yearlyGoalId;
    }

    public void setYearlyGoalId(Long yearlyGoalId) {
        this.yearlyGoalId = yearlyGoalId;
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
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
