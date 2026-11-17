package com.focus.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ritual_logs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"ritual_id", "date"})
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RitualLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ritual_id", nullable = false)
    @JsonIgnore
    private Ritual ritual;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean completed = true;

    private String notes;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;

    @PrePersist
    public void prePersist() {
        if (loggedAt == null) {
            loggedAt = LocalDateTime.now();
        }
    }

    public RitualLog() {}

    public RitualLog(Ritual ritual, LocalDate date, boolean completed) {
        this.ritual = ritual;
        this.date = date;
        this.completed = completed;
    }

    public Long getRitualId() {
        return ritual != null ? ritual.getId() : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ritual getRitual() {
        return ritual;
    }

    public void setRitual(Ritual ritual) {
        this.ritual = ritual;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
