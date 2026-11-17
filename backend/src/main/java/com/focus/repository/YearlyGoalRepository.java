package com.focus.repository;

import com.focus.model.YearlyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YearlyGoalRepository extends JpaRepository<YearlyGoal, Long> {
    List<YearlyGoal> findByArchivedFalse();
    List<YearlyGoal> findByTargetYearAndArchivedFalse(Integer targetYear);
    List<YearlyGoal> findByTargetYear(Integer targetYear);

    @Query("SELECT y FROM YearlyGoal y WHERE y.vision.id = :visionId AND y.archived = false")
    List<YearlyGoal> findByVisionIdAndArchivedFalse(@Param("visionId") Long visionId);

    @Query("SELECT DISTINCT y.targetYear FROM YearlyGoal y ORDER BY y.targetYear DESC")
    List<Integer> findDistinctTargetYears();

    @Query("SELECT y FROM YearlyGoal y LEFT JOIN FETCH y.vision WHERE (:year IS NULL OR y.targetYear = :year)")
    List<YearlyGoal> findAllForReport(@Param("year") Integer year);
}
