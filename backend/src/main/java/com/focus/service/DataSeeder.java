package com.focus.service;

import com.focus.model.*;
import com.focus.model.enums.*;
import com.focus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VisionRepository visionRepository;

    @Autowired
    private YearlyGoalRepository yearlyGoalRepository;

    @Autowired
    private WeeklyGoalRepository weeklyGoalRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private RitualRepository ritualRepository;

    @Autowired
    private RitualLogRepository ritualLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RitualService ritualService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed default user
        if (!userRepository.existsByEmail("focus@user.com")) {
            User user = new User("focus@user.com", passwordEncoder.encode("focus123"), "Alex Mercer");
            userRepository.save(user);
        }

        // Seed demo data if visions are empty
        if (visionRepository.count() == 0) {
            seedInitialData();
        }
    }

    private void seedInitialData() {
        // 1. Visions
        Vision vCareer = new Vision();
        vCareer.setTitle("Master Full-Stack & System Design");
        vCareer.setDescription("Build state-of-the-art scalable web applications and master architecture patterns.");
        vCareer.setLifeArea(LifeArea.CAREER);
        vCareer.setColor("#6366f1"); // Indigo
        vCareer.setIcon("Briefcase");
        vCareer = visionRepository.save(vCareer);

        Vision vHealth = new Vision();
        vHealth.setTitle("Peak Physical Energy & Endurance");
        vHealth.setDescription("Maintain optimal health, athletic capability, endurance, and nutrition.");
        vHealth.setLifeArea(LifeArea.HEALTH);
        vHealth.setColor("#10b981"); // Emerald
        vHealth.setIcon("Heart");
        vHealth = visionRepository.save(vHealth);

        Vision vFinance = new Vision();
        vFinance.setTitle("Financial Autonomy & Smart Investments");
        vFinance.setDescription("Grow diversified passive income and achieve total financial freedom.");
        vFinance.setLifeArea(LifeArea.FINANCE);
        vFinance.setColor("#f59e0b"); // Amber
        vFinance.setIcon("DollarSign");
        vFinance = visionRepository.save(vFinance);

        Vision vMindset = new Vision();
        vMindset.setTitle("Lifelong Learning & Creative Output");
        vMindset.setDescription("Deep intellectual curiosity, writing, and continuous personal growth.");
        vMindset.setLifeArea(LifeArea.PERSONAL_GROWTH);
        vMindset.setColor("#8b5cf6"); // Purple
        vMindset.setIcon("Sparkles");
        vMindset = visionRepository.save(vMindset);

        int currentYear = LocalDate.now().getYear();

        // 2. Yearly Goals
        YearlyGoal yg1 = new YearlyGoal();
        yg1.setVision(vCareer);
        yg1.setTitle("Ship 3 Full-Stack SaaS Products to Production");
        yg1.setDescription("Architect, build, and deploy 3 production apps with Spring Boot, React, and MySQL.");
        yg1.setTargetYear(currentYear);
        yg1.setStatus(GoalStatus.IN_PROGRESS);
        yg1 = yearlyGoalRepository.save(yg1);

        YearlyGoal yg2 = new YearlyGoal();
        yg2.setVision(vHealth);
        yg2.setTitle("Run a Half Marathon & Maintain 12% Body Fat");
        yg2.setDescription("Train consistently 4x per week and complete the Autumn Half Marathon.");
        yg2.setTargetYear(currentYear);
        yg2.setStatus(GoalStatus.IN_PROGRESS);
        yg2 = yearlyGoalRepository.save(yg2);

        YearlyGoal yg3 = new YearlyGoal();
        yg3.setVision(vFinance);
        yg3.setTitle("Invest $25,000 into Index Funds & Real Estate REITs");
        yg3.setDescription("Automate dollar-cost averaging every month into diversified assets.");
        yg3.setTargetYear(currentYear);
        yg3.setStatus(GoalStatus.IN_PROGRESS);
        yg3 = yearlyGoalRepository.save(yg3);

        YearlyGoal yg4 = new YearlyGoal();
        yg4.setVision(vMindset);
        yg4.setTitle("Read 24 Impactful Non-Fiction Books");
        yg4.setDescription("Take actionable notes in Obsidian for every book read.");
        yg4.setTargetYear(currentYear);
        yg4.setStatus(GoalStatus.DONE);
        yg4.setCompletedAt(LocalDateTime.now().minusWeeks(2));
        yg4 = yearlyGoalRepository.save(yg4);

        // 3. Weekly Goals (Sprints)
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = monday.plusDays(6);

        WeeklyGoal activeSprint = new WeeklyGoal();
        activeSprint.setYearlyGoal(yg1);
        activeSprint.setTitle("Sprint 42: Ship Focus MVP & Kanban Workflow");
        activeSprint.setDescription("Deliver complete Jira-style workspace, ticket panel, and sprint tracking.");
        activeSprint.setWeekStartDate(monday);
        activeSprint.setWeekEndDate(sunday);
        activeSprint.setStatus(GoalStatus.IN_PROGRESS);
        activeSprint.setActive(true);
        activeSprint = weeklyGoalRepository.save(activeSprint);

        WeeklyGoal pastSprint = new WeeklyGoal();
        pastSprint.setYearlyGoal(yg2);
        pastSprint.setTitle("Sprint 41: Base Mileage & Hydration Protocol");
        pastSprint.setDescription("Completed 22km cumulative distance and optimized recovery sleep.");
        pastSprint.setWeekStartDate(monday.minusWeeks(1));
        pastSprint.setWeekEndDate(monday.minusDays(1));
        pastSprint.setStatus(GoalStatus.DONE);
        pastSprint.setActive(false);
        pastSprint.setCompletedAt(LocalDateTime.now().minusDays(3));
        pastSprint = weeklyGoalRepository.save(pastSprint);

        // 4. Tasks
        Task t1 = new Task();
        t1.setWeeklyGoal(activeSprint);
        t1.setTitle("Implement Drag-and-Drop Kanban Board with Instant Status Updates");
        t1.setDescription("### Objectives\n- Use `@hello-pangea/dnd` for smooth card movement\n- Allow single-click status changes directly from card badges\n- Support To Do, In Progress, Done, plus optional Backlog and Blocked columns");
        t1.setStatus(TaskStatus.IN_PROGRESS);
        t1.setPriority(Priority.HIGH);
        t1.setDueDate(today);
        t1.setPosition(1.0);
        taskRepository.save(t1);

        Task t2 = new Task();
        t2.setWeeklyGoal(activeSprint);
        t2.setTitle("Build Clickable Breadcrumb Hierarchy (Task -> Sprint -> Goal -> Vision)");
        t2.setDescription("Ensure bi-directional clickable navigation between all layers of the Focus hierarchy.");
        t2.setStatus(TaskStatus.TODO);
        t2.setPriority(Priority.MEDIUM);
        t2.setDueDate(today.plusDays(1));
        t2.setPosition(2.0);
        taskRepository.save(t2);

        Task t3 = new Task();
        t3.setWeeklyGoal(activeSprint);
        t3.setTitle("Create Ticket Detail Slide-Over with Attachments & Rich Text");
        t3.setDescription("Provide rich text markdown editing, priority/status dropdowns, file/image upload, and spreadsheet links.");
        t3.setStatus(TaskStatus.DONE);
        t3.setPriority(Priority.URGENT);
        t3.setDueDate(today.minusDays(1));
        t3.setPosition(1.0);
        t3.setCompletedAt(LocalDateTime.now().minusHours(4));
        taskRepository.save(t3);

        Task t4 = new Task();
        t4.setWeeklyGoal(activeSprint);
        t4.setTitle("Build GitHub-Style Heatmap Calendar for Daily Rituals");
        t4.setDescription("Render matrix of days showing daily completion levels with green shades and streak counts.");
        t4.setStatus(TaskStatus.TODO);
        t4.setPriority(Priority.HIGH);
        t4.setDueDate(today);
        t4.setPosition(3.0);
        taskRepository.save(t4);

        Task t5 = new Task();
        t5.setWeeklyGoal(activeSprint);
        t5.setTitle("Design Yearly Retrospective Screen with Vision Buckets");
        t5.setDescription("Bucket goals into Completed, Still In Progress, and Planned with year filter.");
        t5.setStatus(TaskStatus.TODO);
        t5.setPriority(Priority.MEDIUM);
        t5.setDueDate(today.plusDays(2));
        t5.setPosition(4.0);
        taskRepository.save(t5);

        Task t6 = new Task();
        t6.setWeeklyGoal(null); // Standalone / Backlog
        t6.setTitle("Explore Offline PWA Sync Capabilities");
        t6.setDescription("Evaluate service worker caching for offline flight usage.");
        t6.setStatus(TaskStatus.BACKLOG);
        t6.setPriority(Priority.LOW);
        t6.setPosition(1.0);
        taskRepository.save(t6);

        // 5. Rituals
        Ritual r1 = new Ritual();
        r1.setTitle("Morning Deep Work Session (90 mins)");
        r1.setDescription("Zero interruptions, notifications disabled, focus on core architecture.");
        r1.setFrequency(Frequency.DAILY);
        r1.setVision(vCareer);
        r1.setColor("#6366f1");
        r1.setIcon("Zap");
        r1.setCurrentStreak(16);
        r1.setBestStreak(24);
        r1 = ritualRepository.save(r1);

        Ritual r2 = new Ritual();
        r2.setTitle("Daily Cardio / Strength Training");
        r2.setDescription("Minimum 45 minutes of zone 2 running or resistance training.");
        r2.setFrequency(Frequency.DAILY);
        r2.setVision(vHealth);
        r2.setColor("#10b981");
        r2.setIcon("Activity");
        r2.setCurrentStreak(7);
        r2.setBestStreak(19);
        r2 = ritualRepository.save(r2);

        Ritual r3 = new Ritual();
        r3.setTitle("Read 25 Pages of Technical / Growth Literature");
        r3.setDescription("Reading before bed or early morning with note highlights.");
        r3.setFrequency(Frequency.DAILY);
        r3.setVision(vMindset);
        r3.setColor("#8b5cf6");
        r3.setIcon("BookOpen");
        r3.setCurrentStreak(12);
        r3.setBestStreak(15);
        r3 = ritualRepository.save(r3);

        Ritual r4 = new Ritual();
        r4.setTitle("Weekly Financial & Portfolio Review");
        r4.setDescription("Review weekly expenditures, rebalance investments, track runway.");
        r4.setFrequency(Frequency.WEEKLY);
        r4.setVision(vFinance);
        r4.setColor("#f59e0b");
        r4.setIcon("TrendingUp");
        r4.setCurrentStreak(6);
        r4.setBestStreak(10);
        r4 = ritualRepository.save(r4);

        // 6. Seed past ritual logs for heatmap (past 70 days)
        Random rand = new Random(42);
        Ritual[] rituals = new Ritual[]{r1, r2, r3, r4};

        for (int i = 70; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            for (Ritual r : rituals) {
                // Higher completion probability for daily habits
                double prob = (r.getFrequency() == Frequency.DAILY) ? 0.78 : (date.getDayOfWeek() == DayOfWeek.SUNDAY ? 0.85 : 0.0);
                if (rand.nextDouble() < prob) {
                    RitualLog log = new RitualLog(r, date, true);
                    ritualLogRepository.save(log);
                }
            }
        }

        final Ritual finalR1 = r1;
        ritualLogRepository.findByRitualIdAndDate(finalR1.getId(), today).orElseGet(() -> {
            RitualLog l = new RitualLog(finalR1, today, true);
            return ritualLogRepository.save(l);
        });

        // Recalculate streaks properly
        for (Ritual r : rituals) {
            ritualService.recalculateStreak(r);
        }
    }
}
