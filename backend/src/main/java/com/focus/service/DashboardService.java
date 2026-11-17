package com.focus.service;

import com.focus.dto.DashboardSummaryDTO;
import com.focus.model.Ritual;
import com.focus.model.RitualLog;
import com.focus.model.Task;
import com.focus.model.WeeklyGoal;
import com.focus.model.enums.TaskStatus;
import com.focus.repository.RitualLogRepository;
import com.focus.repository.RitualRepository;
import com.focus.repository.TaskRepository;
import com.focus.repository.WeeklyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private WeeklyGoalRepository weeklyGoalRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RitualRepository ritualRepository;

    @Autowired
    private RitualLogRepository ritualLogRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        LocalDate today = LocalDate.now();

        // 1. Active weekly goal & sprint stats
        Optional<WeeklyGoal> activeGoalOpt = weeklyGoalRepository.findFirstByIsActiveTrueAndArchivedFalse();
        if (activeGoalOpt.isPresent()) {
            WeeklyGoal activeGoal = activeGoalOpt.get();
            summary.setActiveWeeklyGoal(activeGoal);

            List<Task> sprintTasks = taskRepository.findByWeeklyGoalIdAndArchivedFalseOrderByPositionAscCreatedAtDesc(activeGoal.getId());
            int total = sprintTasks.size();
            int completed = 0;
            int inProgress = 0;
            int todo = 0;

            for (Task t : sprintTasks) {
                if (t.getStatus() == TaskStatus.DONE) {
                    completed++;
                } else if (t.getStatus() == TaskStatus.IN_PROGRESS) {
                    inProgress++;
                } else {
                    todo++;
                }
            }

            DashboardSummaryDTO.SprintStatsDTO sprintStats = new DashboardSummaryDTO.SprintStatsDTO();
            sprintStats.setTotalTasks(total);
            sprintStats.setCompletedTasks(completed);
            sprintStats.setInProgressTasks(inProgress);
            sprintStats.setTodoTasks(todo);
            sprintStats.setCompletionPercentage(total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0);

            summary.setSprintStats(sprintStats);
        }

        // 2. Today's tasks (due today or overdue)
        List<Task> todayTasks = taskRepository.findTasksForToday(today);
        summary.setTodayTasks(todayTasks);

        // Count tasks completed today
        int completedTodayCount = 0;
        List<Task> allActive = taskRepository.findByArchivedFalseOrderByPositionAscCreatedAtDesc();
        for (Task t : allActive) {
            if (t.getStatus() == TaskStatus.DONE && t.getCompletedAt() != null &&
                    t.getCompletedAt().toLocalDate().isEqual(today)) {
                completedTodayCount++;
            }
        }
        summary.setCompletedTasksToday(completedTodayCount);

        // 3. Today's rituals with completion state
        List<Ritual> rituals = ritualRepository.findByArchivedFalseOrderByCreatedAtAsc();
        List<DashboardSummaryDTO.RitualTodayDTO> ritualDTOs = new ArrayList<>();
        int maxStreak = 0;

        for (Ritual r : rituals) {
            DashboardSummaryDTO.RitualTodayDTO dto = new DashboardSummaryDTO.RitualTodayDTO();
            dto.setId(r.getId());
            dto.setTitle(r.getTitle());
            dto.setDescription(r.getDescription());
            dto.setFrequency(r.getFrequency().name());
            dto.setColor(r.getColor());
            dto.setIcon(r.getIcon());
            dto.setCurrentStreak(r.getCurrentStreak());
            dto.setBestStreak(r.getBestStreak());

            if (r.getVision() != null) {
                dto.setVisionTitle(r.getVision().getTitle());
                dto.setVisionColor(r.getVision().getColor());
            }

            Optional<RitualLog> log = ritualLogRepository.findByRitualIdAndDate(r.getId(), today);
            dto.setCompletedToday(log.isPresent() && log.get().isCompleted());

            if (r.getCurrentStreak() > maxStreak) {
                maxStreak = r.getCurrentStreak();
            }

            ritualDTOs.add(dto);
        }

        summary.setTodayRituals(ritualDTOs);
        summary.setLongestStreak(maxStreak);

        return summary;
    }
}
