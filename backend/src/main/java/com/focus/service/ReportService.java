package com.focus.service;

import com.focus.dto.ReportsDTO;
import com.focus.model.Ritual;
import com.focus.model.Vision;
import com.focus.model.YearlyGoal;
import com.focus.model.enums.GoalStatus;
import com.focus.repository.RitualRepository;
import com.focus.repository.VisionRepository;
import com.focus.repository.YearlyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ReportService {

    @Autowired
    private YearlyGoalRepository yearlyGoalRepository;

    @Autowired
    private VisionRepository visionRepository;

    @Autowired
    private RitualRepository ritualRepository;

    public ReportsDTO getYearlyRetrospective(Integer year) {
        ReportsDTO report = new ReportsDTO();

        // 1. Available years
        List<Integer> distinctYears = yearlyGoalRepository.findDistinctTargetYears();
        int currentYear = LocalDate.now().getYear();
        if (distinctYears.isEmpty()) {
            distinctYears = new ArrayList<>(List.of(currentYear));
        } else if (!distinctYears.contains(currentYear)) {
            distinctYears = new ArrayList<>(distinctYears);
            distinctYears.add(0, currentYear);
        }
        report.setAvailableYears(distinctYears);

        int selectedYear = (year != null) ? year : currentYear;
        report.setSelectedYear(selectedYear);

        // 2. Fetch all yearly goals for the year (even if archived/dropped/completed)
        List<YearlyGoal> goals = yearlyGoalRepository.findAllForReport(selectedYear);

        // Fetch all visions
        List<Vision> allVisions = visionRepository.findAllByOrderByCreatedAtDesc();
        Map<Long, Vision> visionMap = new LinkedHashMap<>();
        for (Vision v : allVisions) {
            visionMap.put(v.getId(), v);
        }

        // Group goals by vision
        Map<Long, List<YearlyGoal>> goalsByVision = new LinkedHashMap<>();
        List<YearlyGoal> unassignedGoals = new ArrayList<>();

        for (YearlyGoal g : goals) {
            if (g.getVision() != null) {
                goalsByVision.computeIfAbsent(g.getVision().getId(), k -> new ArrayList<>()).add(g);
            } else {
                unassignedGoals.add(g);
            }
        }

        List<ReportsDTO.VisionReportDTO> visionReports = new ArrayList<>();
        int totalGoalsAll = goals.size();
        int completedGoalsAll = 0;
        int inProgressGoalsAll = 0;
        int plannedGoalsAll = 0;
        int droppedGoalsAll = 0;

        for (Vision v : allVisions) {
            List<YearlyGoal> vGoals = goalsByVision.getOrDefault(v.getId(), Collections.emptyList());
            if (vGoals.isEmpty()) {
                // still show vision if it exists, or show with 0 goals
            }

            ReportsDTO.VisionReportDTO vr = buildVisionReport(v, vGoals);
            visionReports.add(vr);

            completedGoalsAll += vr.getCompletedGoals();
            inProgressGoalsAll += vr.getInProgress().size();
            plannedGoalsAll += vr.getPlanned().size();
            droppedGoalsAll += vr.getDropped().size();
        }

        // Handle goals with no vision attached
        if (!unassignedGoals.isEmpty()) {
            ReportsDTO.VisionReportDTO unassignedReport = new ReportsDTO.VisionReportDTO();
            unassignedReport.setVisionId(null);
            unassignedReport.setVisionTitle("General & Standalone Goals");
            unassignedReport.setVisionDescription("Goals not linked to any specific Life Vision");
            unassignedReport.setLifeArea("GENERAL");
            unassignedReport.setColor("#6b7280");
            unassignedReport.setIcon("Target");

            populateBuckets(unassignedReport, unassignedGoals);
            visionReports.add(unassignedReport);

            completedGoalsAll += unassignedReport.getCompletedGoals();
            inProgressGoalsAll += unassignedReport.getInProgress().size();
            plannedGoalsAll += unassignedReport.getPlanned().size();
            droppedGoalsAll += unassignedReport.getDropped().size();
        }

        report.setVisionReports(visionReports);

        // Overall stats
        ReportsDTO.OverallReportStats stats = new ReportsDTO.OverallReportStats();
        stats.setTotalGoals(totalGoalsAll);
        stats.setCompletedGoals(completedGoalsAll);
        stats.setInProgressGoals(inProgressGoalsAll);
        stats.setPlannedGoals(plannedGoalsAll);
        stats.setDroppedGoals(droppedGoalsAll);
        stats.setYearlyCompletionRate(totalGoalsAll > 0
                ? Math.round(((double) completedGoalsAll / totalGoalsAll) * 1000.0) / 10.0
                : 0.0);

        // Longest ritual streak
        int longestStreak = 0;
        for (Ritual r : ritualRepository.findAll()) {
            if (r.getBestStreak() != null && r.getBestStreak() > longestStreak) {
                longestStreak = r.getBestStreak();
            }
        }
        stats.setLongestRitualStreak(longestStreak);

        report.setStats(stats);
        return report;
    }

    private ReportsDTO.VisionReportDTO buildVisionReport(Vision v, List<YearlyGoal> vGoals) {
        ReportsDTO.VisionReportDTO vr = new ReportsDTO.VisionReportDTO();
        vr.setVisionId(v.getId());
        vr.setVisionTitle(v.getTitle());
        vr.setVisionDescription(v.getDescription());
        vr.setLifeArea(v.getLifeArea() != null ? v.getLifeArea().name() : "OTHER");
        vr.setColor(v.getColor());
        vr.setIcon(v.getIcon());

        populateBuckets(vr, vGoals);
        return vr;
    }

    private void populateBuckets(ReportsDTO.VisionReportDTO vr, List<YearlyGoal> goals) {
        int completedCount = 0;
        for (YearlyGoal g : goals) {
            if (g.getStatus() == GoalStatus.DONE) {
                vr.getCompleted().add(g);
                completedCount++;
            } else if (g.getStatus() == GoalStatus.IN_PROGRESS) {
                vr.getInProgress().add(g);
            } else if (g.getStatus() == GoalStatus.DROPPED) {
                vr.getDropped().add(g);
            } else {
                vr.getPlanned().add(g);
            }
        }
        vr.setTotalGoals(goals.size());
        vr.setCompletedGoals(completedCount);
        vr.setCompletionRate(goals.size() > 0
                ? Math.round(((double) completedCount / goals.size()) * 1000.0) / 10.0
                : 0.0);
    }
}
