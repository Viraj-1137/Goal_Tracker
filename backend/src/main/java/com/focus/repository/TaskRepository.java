package com.focus.repository;

import com.focus.model.Task;
import com.focus.model.enums.Priority;
import com.focus.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByArchivedFalseOrderByPositionAscCreatedAtDesc();

    @Query("SELECT t FROM Task t WHERE t.weeklyGoal.id = :weeklyGoalId AND t.archived = false ORDER BY t.position ASC, t.createdAt DESC")
    List<Task> findByWeeklyGoalIdAndArchivedFalseOrderByPositionAscCreatedAtDesc(@Param("weeklyGoalId") Long weeklyGoalId);

    List<Task> findByStatusAndArchivedFalse(TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.archived = false AND (t.dueDate = :date OR (t.dueDate <= :date AND t.status <> com.focus.model.enums.TaskStatus.DONE)) ORDER BY t.priority DESC, t.dueDate ASC")
    List<Task> findTasksForToday(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.archived = false " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:priority IS NULL OR t.priority = :priority) " +
            "AND (:weeklyGoalId IS NULL OR t.weeklyGoal.id = :weeklyGoalId) " +
            "ORDER BY t.position ASC, t.createdAt DESC")
    List<Task> searchTasks(@Param("status") TaskStatus status,
                           @Param("priority") Priority priority,
                           @Param("weeklyGoalId") Long weeklyGoalId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.weeklyGoal.id = :weeklyGoalId AND t.archived = false")
    long countByWeeklyGoalIdAndArchivedFalse(@Param("weeklyGoalId") Long weeklyGoalId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.weeklyGoal.id = :weeklyGoalId AND t.status = :status AND t.archived = false")
    long countByWeeklyGoalIdAndStatusAndArchivedFalse(@Param("weeklyGoalId") Long weeklyGoalId, @Param("status") TaskStatus status);
}
