package com.focus.dto;

import com.focus.model.enums.LifeArea;

public class VisionRequest {
    private String title;
    private String description;
    private LifeArea lifeArea = LifeArea.CAREER;
    private String color = "#6366f1";
    private String icon = "Compass";

    public VisionRequest() {}

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

    public LifeArea getLifeArea() {
        return lifeArea;
    }

    public void setLifeArea(LifeArea lifeArea) {
        this.lifeArea = lifeArea;
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
