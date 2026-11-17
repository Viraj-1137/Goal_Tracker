package com.focus.repository;

import com.focus.model.WeeklyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyGoalRepository extends JpaRepository<WeeklyGoal, Long> {
    List<WeeklyGoal> findByArchivedFalseOrderByWeekStartDateDesc();

    @Query("SELECT w FROM WeeklyGoal w WHERE w.yearlyGoal.id = :yearlyGoalId AND w.archived = false")
    List<WeeklyGoal> findByYearlyGoalIdAndArchivedFalse(@Param("yearlyGoalId") Long yearlyGoalId);

    Optional<WeeklyGoal> findFirstByIsActiveTrueAndArchivedFalse();

    @Modifying
    @Query("UPDATE WeeklyGoal w SET w.isActive = false WHERE w.id <> :activeId")
    void deactivateAllExcept(Long activeId);

    @Modifying
    @Query("UPDATE WeeklyGoal w SET w.isActive = false")
    void deactivateAll();
}
