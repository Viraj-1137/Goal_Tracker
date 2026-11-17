package com.focus.dto;

import com.focus.model.YearlyGoal;

import java.util.ArrayList;
import java.util.List;

public class ReportsDTO {
    private Integer selectedYear;
    private List<Integer> availableYears = new ArrayList<>();
    private List<VisionReportDTO> visionReports = new ArrayList<>();
    private OverallReportStats stats = new OverallReportStats();

    public ReportsDTO() {}

    public static class VisionReportDTO {
        private Long visionId;
        private String visionTitle;
        private String visionDescription;
        private String lifeArea;
        private String color;
        private String icon;
        private int totalGoals = 0;
        private int completedGoals = 0;
        private double completionRate = 0.0;
        private List<YearlyGoal> completed = new ArrayList<>();
        private List<YearlyGoal> inProgress = new ArrayList<>();
        private List<YearlyGoal> planned = new ArrayList<>();
        private List<YearlyGoal> dropped = new ArrayList<>();

        public VisionReportDTO() {}

        public Long getVisionId() {
            return visionId;
        }

        public void setVisionId(Long visionId) {
            this.visionId = visionId;
        }

        public String getVisionTitle() {
            return visionTitle;
        }

        public void setVisionTitle(String visionTitle) {
            this.visionTitle = visionTitle;
        }

        public String getVisionDescription() {
            return visionDescription;
        }

        public void setVisionDescription(String visionDescription) {
            this.visionDescription = visionDescription;
        }

        public String getLifeArea() {
            return lifeArea;
        }

        public void setLifeArea(String lifeArea) {
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

        public int getTotalGoals() {
            return totalGoals;
        }

        public void setTotalGoals(int totalGoals) {
            this.totalGoals = totalGoals;
        }

        public int getCompletedGoals() {
            return completedGoals;
        }

        public void setCompletedGoals(int completedGoals) {
            this.completedGoals = completedGoals;
        }

        public double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(double completionRate) {
            this.completionRate = completionRate;
        }

        public List<YearlyGoal> getCompleted() {
            return completed;
        }

        public void setCompleted(List<YearlyGoal> completed) {
            this.completed = completed;
        }

        public List<YearlyGoal> getInProgress() {
            return inProgress;
        }

        public void setInProgress(List<YearlyGoal> inProgress) {
            this.inProgress = inProgress;
        }

        public List<YearlyGoal> getPlanned() {
            return planned;
        }

        public void setPlanned(List<YearlyGoal> planned) {
            this.planned = planned;
        }

        public List<YearlyGoal> getDropped() {
            return dropped;
        }

        public void setDropped(List<YearlyGoal> dropped) {
            this.dropped = dropped;
        }
    }

    public static class OverallReportStats {
        private int totalGoals = 0;
        private int completedGoals = 0;
        private int inProgressGoals = 0;
        private int plannedGoals = 0;
        private int droppedGoals = 0;
        private double yearlyCompletionRate = 0.0;
        private int longestRitualStreak = 0;

        public OverallReportStats() {}

        public int getTotalGoals() {
            return totalGoals;
        }

        public void setTotalGoals(int totalGoals) {
            this.totalGoals = totalGoals;
        }

        public int getCompletedGoals() {
            return completedGoals;
        }

        public void setCompletedGoals(int completedGoals) {
            this.completedGoals = completedGoals;
        }

        public int getInProgressGoals() {
            return inProgressGoals;
        }

        public void setInProgressGoals(int inProgressGoals) {
            this.inProgressGoals = inProgressGoals;
        }

        public int getPlannedGoals() {
            return plannedGoals;
        }

        public void setPlannedGoals(int plannedGoals) {
            this.plannedGoals = plannedGoals;
        }

        public int getDroppedGoals() {
            return droppedGoals;
        }

        public void setDroppedGoals(int droppedGoals) {
            this.droppedGoals = droppedGoals;
        }

        public double getYearlyCompletionRate() {
            return yearlyCompletionRate;
        }

        public void setYearlyCompletionRate(double yearlyCompletionRate) {
            this.yearlyCompletionRate = yearlyCompletionRate;
        }

        public int getLongestRitualStreak() {
            return longestRitualStreak;
        }

        public void setLongestRitualStreak(int longestRitualStreak) {
            this.longestRitualStreak = longestRitualStreak;
        }
    }

    public Integer getSelectedYear() {
        return selectedYear;
    }

    public void setSelectedYear(Integer selectedYear) {
        this.selectedYear = selectedYear;
    }

    public List<Integer> getAvailableYears() {
        return availableYears;
    }

    public void setAvailableYears(List<Integer> availableYears) {
        this.availableYears = availableYears;
    }

    public List<VisionReportDTO> getVisionReports() {
        return visionReports;
    }

    public void setVisionReports(List<VisionReportDTO> visionReports) {
        this.visionReports = visionReports;
    }

    public OverallReportStats getStats() {
        return stats;
    }

    public void setStats(OverallReportStats stats) {
        this.stats = stats;
    }
}
