package com.focus.dto;

import com.focus.model.enums.TaskStatus;

public class PositionUpdateRequest {
    private Long taskId;
    private TaskStatus status;
    private Double position;

    public PositionUpdateRequest() {}

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Double getPosition() {
        return position;
    }

    public void setPosition(Double position) {
        this.position = position;
    }
}
