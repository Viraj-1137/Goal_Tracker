package com.focus.dto;

import com.focus.model.Task;
import com.focus.model.WeeklyGoal;

import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryDTO {
    private WeeklyGoal activeWeeklyGoal;
    private List<Task> todayTasks = new ArrayList<>();
    private List<RitualTodayDTO> todayRituals = new ArrayList<>();
    private SprintStatsDTO sprintStats = new SprintStatsDTO();
    private int completedTasksToday = 0;
    private int longestStreak = 0;

    public DashboardSummaryDTO() {}

    public static class RitualTodayDTO {
        private Long id;
        private String title;
        private String description;
        private String frequency;
        private String visionTitle;
        private String visionColor;
        private String color;
        private String icon;
        private int currentStreak;
        private int bestStreak;
        private boolean completedToday;

        public RitualTodayDTO() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getVisionTitle() {
            return visionTitle;
        }

        public void setVisionTitle(String visionTitle) {
            this.visionTitle = visionTitle;
        }

        public String getVisionColor() {
            return visionColor;
        }

        public void setVisionColor(String visionColor) {
            this.visionColor = visionColor;
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

        public int getCurrentStreak() {
            return currentStreak;
        }

        public void setCurrentStreak(int currentStreak) {
            this.currentStreak = currentStreak;
        }

        public int getBestStreak() {
            return bestStreak;
        }

        public void setBestStreak(int bestStreak) {
            this.bestStreak = bestStreak;
        }

        public boolean isCompletedToday() {
            return completedToday;
        }

        public void setCompletedToday(boolean completedToday) {
            this.completedToday = completedToday;
        }
    }

    public static class SprintStatsDTO {
        private int totalTasks = 0;
        private int completedTasks = 0;
        private int inProgressTasks = 0;
        private int todoTasks = 0;
        private int completionPercentage = 0;

        public SprintStatsDTO() {}

        public int getTotalTasks() {
            return totalTasks;
        }

        public void setTotalTasks(int totalTasks) {
            this.totalTasks = totalTasks;
        }

        public int getCompletedTasks() {
            return completedTasks;
        }

        public void setCompletedTasks(int completedTasks) {
            this.completedTasks = completedTasks;
        }

        public int getInProgressTasks() {
            return inProgressTasks;
        }

        public void setInProgressTasks(int inProgressTasks) {
            this.inProgressTasks = inProgressTasks;
        }

        public int getTodoTasks() {
            return todoTasks;
        }

        public void setTodoTasks(int todoTasks) {
            this.todoTasks = todoTasks;
        }

        public int getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(int completionPercentage) {
            this.completionPercentage = completionPercentage;
        }
    }

    public WeeklyGoal getActiveWeeklyGoal() {
        return activeWeeklyGoal;
    }

    public void setActiveWeeklyGoal(WeeklyGoal activeWeeklyGoal) {
        this.activeWeeklyGoal = activeWeeklyGoal;
    }

    public List<Task> getTodayTasks() {
        return todayTasks;
    }

    public void setTodayTasks(List<Task> todayTasks) {
        this.todayTasks = todayTasks;
    }

    public List<RitualTodayDTO> getTodayRituals() {
        return todayRituals;
    }

    public void setTodayRituals(List<RitualTodayDTO> todayRituals) {
        this.todayRituals = todayRituals;
    }

    public SprintStatsDTO getSprintStats() {
        return sprintStats;
    }

    public void setSprintStats(SprintStatsDTO sprintStats) {
        this.sprintStats = sprintStats;
    }

    public int getCompletedTasksToday() {
        return completedTasksToday;
    }

    public void setCompletedTasksToday(int completedTasksToday) {
        this.completedTasksToday = completedTasksToday;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }
}
