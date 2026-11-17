package com.focus.repository;

import com.focus.model.Vision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisionRepository extends JpaRepository<Vision, Long> {
    List<Vision> findByArchivedFalseOrderByCreatedAtDesc();
    List<Vision> findAllByOrderByCreatedAtDesc();
}
