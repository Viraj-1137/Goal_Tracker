package com.focus.dto;

import com.focus.model.enums.Frequency;

public class RitualRequest {
    private String title;
    private String description;
    private Frequency frequency = Frequency.DAILY;
    private Long visionId;
    private String color = "#10b981";
    private String icon = "Zap";

    public RitualRequest() {}

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

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Long getVisionId() {
        return visionId;
    }

    public void setVisionId(Long visionId) {
        this.visionId = visionId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
