package com.focus.repository;

import com.focus.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT a FROM Attachment a WHERE a.task.id = :taskId ORDER BY a.createdAt DESC")
    List<Attachment> findByTaskIdOrderByCreatedAtDesc(@org.springframework.data.repository.query.Param("taskId") Long taskId);
}
