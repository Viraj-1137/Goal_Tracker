package com.focus.dto;

public class CloseSprintRequest {
    /**
     * Action to take for incomplete tasks:
     * - "NEXT_SPRINT": move them to nextWeeklyGoalId (or newly created next sprint)
     * - "BACKLOG": move status to BACKLOG and clear weekly_goal_id
     * - "DROP": set status to BLOCKED or archive or mark DROPPED
     */
    private String incompleteAction; // NEXT_SPRINT, BACKLOG, DROP
    private Long nextWeeklyGoalId;
    private String nextWeeklyGoalTitle;

    public CloseSprintRequest() {}

    public String getIncompleteAction() {
        return incompleteAction;
    }

    public void setIncompleteAction(String incompleteAction) {
        this.incompleteAction = incompleteAction;
    }

    public Long getNextWeeklyGoalId() {
        return nextWeeklyGoalId;
    }

    public void setNextWeeklyGoalId(Long nextWeeklyGoalId) {
        this.nextWeeklyGoalId = nextWeeklyGoalId;
    }

    public String getNextWeeklyGoalTitle() {
        return nextWeeklyGoalTitle;
    }

    public void setNextWeeklyGoalTitle(String nextWeeklyGoalTitle) {
        this.nextWeeklyGoalTitle = nextWeeklyGoalTitle;
    }
}
