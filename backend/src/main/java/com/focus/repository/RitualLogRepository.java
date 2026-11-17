package com.focus.repository;

import com.focus.model.RitualLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RitualLogRepository extends JpaRepository<RitualLog, Long> {
    @Query("SELECT l FROM RitualLog l WHERE l.ritual.id = :ritualId AND l.date = :date")
    Optional<RitualLog> findByRitualIdAndDate(@Param("ritualId") Long ritualId, @Param("date") LocalDate date);

    @Query("SELECT l FROM RitualLog l WHERE l.ritual.id = :ritualId AND l.date BETWEEN :startDate AND :endDate ORDER BY l.date ASC")
    List<RitualLog> findByRitualIdAndDateBetweenOrderByDateAsc(@Param("ritualId") Long ritualId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<RitualLog> findByDate(LocalDate date);

    List<RitualLog> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT l.date, COUNT(l) FROM RitualLog l WHERE l.completed = true AND l.date BETWEEN :startDate AND :endDate GROUP BY l.date ORDER BY l.date ASC")
    List<Object[]> countCompletedLogsPerDayBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT l FROM RitualLog l WHERE l.ritual.id = :ritualId ORDER BY l.date DESC")
    List<RitualLog> findByRitualIdOrderByDateDesc(@Param("ritualId") Long ritualId);
}
