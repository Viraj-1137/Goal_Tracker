package com.focus.dto;

import java.time.LocalDate;

public class RitualLogRequest {
    private LocalDate date;
    private Boolean completed;
    private String notes;

    public RitualLogRequest() {}

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
