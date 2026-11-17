package com.focus.repository;

import com.focus.model.Ritual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RitualRepository extends JpaRepository<Ritual, Long> {
    List<Ritual> findByArchivedFalseOrderByCreatedAtAsc();

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Ritual r WHERE r.vision.id = :visionId AND r.archived = false")
    List<Ritual> findByVisionIdAndArchivedFalse(@org.springframework.data.repository.query.Param("visionId") Long visionId);
}
