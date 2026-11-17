package com.focus.dto;

import com.focus.model.enums.TaskStatus;

public class StatusUpdateRequest {
    private TaskStatus status;
    private Double position;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(TaskStatus status) {
        this.status = status;
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
