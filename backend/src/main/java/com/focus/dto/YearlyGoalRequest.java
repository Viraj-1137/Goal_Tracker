package com.focus.dto;

import com.focus.model.enums.GoalStatus;

public class YearlyGoalRequest {
    private Long visionId;
    private String title;
    private String description;
    private Integer targetYear;
    private GoalStatus status = GoalStatus.TODO;

    public YearlyGoalRequest() {}

    public Long getVisionId() {
        return visionId;
    }

    public void setVisionId(Long visionId) {
        this.visionId = visionId;
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

    public Integer getTargetYear() {
        return targetYear;
    }

    public void setTargetYear(Integer targetYear) {
        this.targetYear = targetYear;
    }

    public GoalStatus getStatus() {
        return status;
    }

    public void setStatus(GoalStatus status) {
        this.status = status;
    }
}
