package com.focus.service;

import com.focus.dto.RitualLogRequest;
import com.focus.dto.RitualRequest;
import com.focus.model.Ritual;
import com.focus.model.RitualLog;
import com.focus.model.Vision;
import com.focus.repository.RitualLogRepository;
import com.focus.repository.RitualRepository;
import com.focus.repository.VisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class RitualService {

    @Autowired
    private RitualRepository ritualRepository;

    @Autowired
    private RitualLogRepository ritualLogRepository;

    @Autowired
    private VisionRepository visionRepository;

    public List<Ritual> getAllActiveRituals() {
        return ritualRepository.findByArchivedFalseOrderByCreatedAtAsc();
    }

    public Ritual getRitualById(Long id) {
        return ritualRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ritual not found with id: " + id));
    }

    public Ritual createRitual(RitualRequest request) {
        Ritual ritual = new Ritual();
        ritual.setTitle(request.getTitle());
        ritual.setDescription(request.getDescription());
        if (request.getFrequency() != null) ritual.setFrequency(request.getFrequency());
        if (request.getColor() != null) ritual.setColor(request.getColor());
        if (request.getIcon() != null) ritual.setIcon(request.getIcon());

        if (request.getVisionId() != null) {
            Vision vision = visionRepository.findById(request.getVisionId())
                    .orElseThrow(() -> new IllegalArgumentException("Vision not found: " + request.getVisionId()));
            ritual.setVision(vision);
        }

        return ritualRepository.save(ritual);
    }

    public Ritual updateRitual(Long id, RitualRequest request) {
        Ritual ritual = getRitualById(id);
        if (request.getTitle() != null) ritual.setTitle(request.getTitle());
        if (request.getDescription() != null) ritual.setDescription(request.getDescription());
        if (request.getFrequency() != null) ritual.setFrequency(request.getFrequency());
        if (request.getColor() != null) ritual.setColor(request.getColor());
        if (request.getIcon() != null) ritual.setIcon(request.getIcon());

        if (request.getVisionId() != null) {
            Vision vision = visionRepository.findById(request.getVisionId())
                    .orElseThrow(() -> new IllegalArgumentException("Vision not found: " + request.getVisionId()));
            ritual.setVision(vision);
        } else {
            ritual.setVision(null);
        }

        return ritualRepository.save(ritual);
    }

    public void archiveRitual(Long id) {
        Ritual ritual = getRitualById(id);
        ritual.setArchived(true);
        ritualRepository.save(ritual);
    }

    /**
     * Toggle completion for a ritual on a specific date (defaults to today).
     */
    public RitualLog toggleRitualCompletion(Long ritualId, LocalDate date, Boolean completed, String notes) {
        Ritual ritual = getRitualById(ritualId);
        LocalDate targetDate = date != null ? date : LocalDate.now();

        Optional<RitualLog> existing = ritualLogRepository.findByRitualIdAndDate(ritualId, targetDate);
        RitualLog log;

        if (existing.isPresent()) {
            log = existing.get();
            boolean newStatus = completed != null ? completed : !log.isCompleted();
            log.setCompleted(newStatus);
            if (notes != null) log.setNotes(notes);
        } else {
            boolean status = completed != null ? completed : true;
            log = new RitualLog(ritual, targetDate, status);
            if (notes != null) log.setNotes(notes);
        }

        RitualLog savedLog = ritualLogRepository.save(log);

        // Recalculate streak for this ritual
        recalculateStreak(ritual);

        return savedLog;
    }

    public void recalculateStreak(Ritual ritual) {
        List<RitualLog> logs = ritualLogRepository.findByRitualIdOrderByDateDesc(ritual.getId());
        Set<LocalDate> completedDates = new HashSet<>();
        for (RitualLog log : logs) {
            if (log.isCompleted()) {
                completedDates.add(log.getDate());
            }
        }

        LocalDate today = LocalDate.now();
        int currentStreak = 0;
        LocalDate cursor = today;

        // If today is completed, start from today, else start from yesterday
        if (completedDates.contains(today)) {
            while (completedDates.contains(cursor)) {
                currentStreak++;
                cursor = cursor.minusDays(1);
            }
        } else if (completedDates.contains(today.minusDays(1))) {
            cursor = today.minusDays(1);
            while (completedDates.contains(cursor)) {
                currentStreak++;
                cursor = cursor.minusDays(1);
            }
        }

        // Calculate all-time best streak
        List<LocalDate> sortedDates = new ArrayList<>(completedDates);
        Collections.sort(sortedDates);

        int maxStreak = 0;
        int runningStreak = 0;
        LocalDate prev = null;

        for (LocalDate d : sortedDates) {
            if (prev == null || prev.plusDays(1).equals(d)) {
                runningStreak++;
            } else {
                runningStreak = 1;
            }
            if (runningStreak > maxStreak) {
                maxStreak = runningStreak;
            }
            prev = d;
        }

        ritual.setCurrentStreak(currentStreak);
        if (maxStreak > ritual.getBestStreak()) {
            ritual.setBestStreak(maxStreak);
        }
        if (currentStreak > ritual.getBestStreak()) {
            ritual.setBestStreak(currentStreak);
        }

        ritualRepository.save(ritual);
    }

    public Map<LocalDate, Boolean> getRitualLogsForDateRange(Long ritualId, LocalDate start, LocalDate end) {
        List<RitualLog> logs = ritualLogRepository.findByRitualIdAndDateBetweenOrderByDateAsc(ritualId, start, end);
        Map<LocalDate, Boolean> map = new HashMap<>();
        for (RitualLog log : logs) {
            map.put(log.getDate(), log.isCompleted());
        }
        return map;
    }

    /**
     * Contribution Heatmap: Date -> count of completed rituals on that day
     */
    public Map<String, Integer> getContributionHeatmap(LocalDate start, LocalDate end) {
        List<Object[]> rows = ritualLogRepository.countCompletedLogsPerDayBetween(start, end);
        Map<String, Integer> heatmap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            Number count = (Number) row[1];
            heatmap.put(date.toString(), count.intValue());
        }
        return heatmap;
    }

    public int getGlobalLongestStreak() {
        List<Ritual> rituals = ritualRepository.findAll();
        int max = 0;
        for (Ritual r : rituals) {
            if (r.getBestStreak() != null && r.getBestStreak() > max) {
                max = r.getBestStreak();
            }
        }
        return max;
    }
}
