package com.focus.service;

import com.focus.dto.CloseSprintRequest;
import com.focus.dto.WeeklyGoalRequest;
import com.focus.dto.YearlyGoalRequest;
import com.focus.model.Task;
import com.focus.model.WeeklyGoal;
import com.focus.model.YearlyGoal;
import com.focus.model.Vision;
import com.focus.model.enums.GoalStatus;
import com.focus.model.enums.TaskStatus;
import com.focus.repository.TaskRepository;
import com.focus.repository.WeeklyGoalRepository;
import com.focus.repository.YearlyGoalRepository;
import com.focus.repository.VisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GoalService {

    @Autowired
    private YearlyGoalRepository yearlyGoalRepository;

    @Autowired
    private WeeklyGoalRepository weeklyGoalRepository;

    @Autowired
    private VisionRepository visionRepository;

    @Autowired
    private TaskRepository taskRepository;

    // --- Yearly Goal Operations ---

    public List<YearlyGoal> getAllActiveYearlyGoals() {
        return yearlyGoalRepository.findByArchivedFalse();
    }

    public List<YearlyGoal> getYearlyGoalsByYear(Integer year) {
        return yearlyGoalRepository.findByTargetYearAndArchivedFalse(year);
    }

    public List<YearlyGoal> getYearlyGoalsByVision(Long visionId) {
        return yearlyGoalRepository.findByVisionIdAndArchivedFalse(visionId);
    }

    public YearlyGoal getYearlyGoalById(Long id) {
        return yearlyGoalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Yearly Goal not found with id: " + id));
    }

    public YearlyGoal createYearlyGoal(YearlyGoalRequest request) {
        YearlyGoal goal = new YearlyGoal();
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setTargetYear(request.getTargetYear() != null ? request.getTargetYear() : LocalDate.now().getYear());
        if (request.getStatus() != null) {
            goal.setStatus(request.getStatus());
        }
        if (request.getVisionId() != null) {
            Vision vision = visionRepository.findById(request.getVisionId())
                    .orElseThrow(() -> new IllegalArgumentException("Vision not found with id: " + request.getVisionId()));
            goal.setVision(vision);
        }
        return yearlyGoalRepository.save(goal);
    }

    public YearlyGoal updateYearlyGoal(Long id, YearlyGoalRequest request) {
        YearlyGoal goal = getYearlyGoalById(id);
        if (request.getTitle() != null) goal.setTitle(request.getTitle());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        if (request.getTargetYear() != null) goal.setTargetYear(request.getTargetYear());
        if (request.getStatus() != null) goal.setStatus(request.getStatus());

        if (request.getVisionId() != null) {
            Vision vision = visionRepository.findById(request.getVisionId())
                    .orElseThrow(() -> new IllegalArgumentException("Vision not found: " + request.getVisionId()));
            goal.setVision(vision);
        } else {
            goal.setVision(null);
        }

        return yearlyGoalRepository.save(goal);
    }

    public YearlyGoal updateYearlyGoalStatus(Long id, GoalStatus status) {
        YearlyGoal goal = getYearlyGoalById(id);
        goal.setStatus(status);
        return yearlyGoalRepository.save(goal);
    }

    public void archiveYearlyGoal(Long id) {
        YearlyGoal goal = getYearlyGoalById(id);
        goal.setArchived(true);
        yearlyGoalRepository.save(goal);
    }

    // --- Weekly Goal (Sprint) Operations ---

    public List<WeeklyGoal> getAllActiveWeeklyGoals() {
        return weeklyGoalRepository.findByArchivedFalseOrderByWeekStartDateDesc();
    }

    public List<WeeklyGoal> getWeeklyGoalsByYearlyGoal(Long yearlyGoalId) {
        return weeklyGoalRepository.findByYearlyGoalIdAndArchivedFalse(yearlyGoalId);
    }

    public WeeklyGoal getWeeklyGoalById(Long id) {
        return weeklyGoalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Weekly Goal not found with id: " + id));
    }

    public Optional<WeeklyGoal> getActiveSprint() {
        return weeklyGoalRepository.findFirstByIsActiveTrueAndArchivedFalse();
    }

    public WeeklyGoal createWeeklyGoal(WeeklyGoalRequest request) {
        WeeklyGoal goal = new WeeklyGoal();
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setWeekStartDate(request.getWeekStartDate() != null ? request.getWeekStartDate() : LocalDate.now());
        goal.setWeekEndDate(request.getWeekEndDate() != null ? request.getWeekEndDate() : LocalDate.now().plusDays(6));
        if (request.getStatus() != null) {
            goal.setStatus(request.getStatus());
        }
        if (request.getYearlyGoalId() != null) {
            YearlyGoal yearlyGoal = yearlyGoalRepository.findById(request.getYearlyGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("Yearly Goal not found: " + request.getYearlyGoalId()));
            goal.setYearlyGoal(yearlyGoal);
        }

        if (Boolean.TRUE.equals(request.getIsActive())) {
            weeklyGoalRepository.deactivateAll();
            goal.setActive(true);
        }

        return weeklyGoalRepository.save(goal);
    }

    public WeeklyGoal updateWeeklyGoal(Long id, WeeklyGoalRequest request) {
        WeeklyGoal goal = getWeeklyGoalById(id);
        if (request.getTitle() != null) goal.setTitle(request.getTitle());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        if (request.getWeekStartDate() != null) goal.setWeekStartDate(request.getWeekStartDate());
        if (request.getWeekEndDate() != null) goal.setWeekEndDate(request.getWeekEndDate());
        if (request.getStatus() != null) goal.setStatus(request.getStatus());

        if (request.getYearlyGoalId() != null) {
            YearlyGoal yearlyGoal = yearlyGoalRepository.findById(request.getYearlyGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("Yearly Goal not found: " + request.getYearlyGoalId()));
            goal.setYearlyGoal(yearlyGoal);
        } else {
            goal.setYearlyGoal(null);
        }

        if (Boolean.TRUE.equals(request.getIsActive())) {
            weeklyGoalRepository.deactivateAllExcept(goal.getId());
            goal.setActive(true);
        } else if (Boolean.FALSE.equals(request.getIsActive())) {
            goal.setActive(false);
        }

        return weeklyGoalRepository.save(goal);
    }

    public WeeklyGoal updateWeeklyGoalStatus(Long id, GoalStatus status) {
        WeeklyGoal goal = getWeeklyGoalById(id);
        goal.setStatus(status);
        return weeklyGoalRepository.save(goal);
    }

    public WeeklyGoal setActiveSprint(Long id) {
        WeeklyGoal goal = getWeeklyGoalById(id);
        weeklyGoalRepository.deactivateAllExcept(goal.getId());
        goal.setActive(true);
        return weeklyGoalRepository.save(goal);
    }

    public WeeklyGoal closeSprint(Long id, CloseSprintRequest request) {
        WeeklyGoal sprint = getWeeklyGoalById(id);
        sprint.setActive(false);
        sprint.setStatus(GoalStatus.DONE);
        sprint.setCompletedAt(LocalDateTime.now());
        weeklyGoalRepository.save(sprint);

        // Fetch tasks associated with this sprint
        List<Task> tasks = taskRepository.findByWeeklyGoalIdAndArchivedFalseOrderByPositionAscCreatedAtDesc(id);

        String action = request != null && request.getIncompleteAction() != null
                ? request.getIncompleteAction()
                : "BACKLOG";

        WeeklyGoal nextSprint = null;
        if ("NEXT_SPRINT".equalsIgnoreCase(action)) {
            if (request.getNextWeeklyGoalId() != null) {
                nextSprint = getWeeklyGoalById(request.getNextWeeklyGoalId());
            } else {
                // Create a new sprint for next week
                WeeklyGoal newGoal = new WeeklyGoal();
                String title = request.getNextWeeklyGoalTitle() != null && !request.getNextWeeklyGoalTitle().isBlank()
                        ? request.getNextWeeklyGoalTitle()
                        : "Next Sprint: " + LocalDate.now().plusWeeks(1);
                newGoal.setTitle(title);
                newGoal.setWeekStartDate(sprint.getWeekEndDate() != null ? sprint.getWeekEndDate().plusDays(1) : LocalDate.now());
                newGoal.setWeekEndDate(newGoal.getWeekStartDate().plusDays(6));
                newGoal.setYearlyGoal(sprint.getYearlyGoal());
                newGoal.setActive(true);
                nextSprint = weeklyGoalRepository.save(newGoal);
            }
        }

        for (Task task : tasks) {
            if (task.getStatus() != TaskStatus.DONE) {
                if ("NEXT_SPRINT".equalsIgnoreCase(action) && nextSprint != null) {
                    task.setWeeklyGoal(nextSprint);
                    taskRepository.save(task);
                } else if ("BACKLOG".equalsIgnoreCase(action)) {
                    task.setStatus(TaskStatus.BACKLOG);
                    task.setWeeklyGoal(null);
                    taskRepository.save(task);
                } else if ("DROP".equalsIgnoreCase(action)) {
                    task.setStatus(TaskStatus.BLOCKED);
                    task.setArchived(true);
                    taskRepository.save(task);
                }
            }
        }

        return sprint;
    }

    public void archiveWeeklyGoal(Long id) {
        WeeklyGoal goal = getWeeklyGoalById(id);
        goal.setArchived(true);
        goal.setActive(false);
        weeklyGoalRepository.save(goal);
    }
}
