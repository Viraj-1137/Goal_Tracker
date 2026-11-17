package com.focus.service;

import com.focus.dto.VisionRequest;
import com.focus.model.Vision;
import com.focus.repository.VisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VisionService {

    @Autowired
    private VisionRepository visionRepository;

    public List<Vision> getAllActiveVisions() {
        return visionRepository.findByArchivedFalseOrderByCreatedAtDesc();
    }

    public List<Vision> getAllVisions() {
        return visionRepository.findAllByOrderByCreatedAtDesc();
    }

    public Vision getVisionById(Long id) {
        return visionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vision not found with id: " + id));
    }

    public Vision createVision(VisionRequest request) {
        Vision vision = new Vision();
        vision.setTitle(request.getTitle());
        vision.setDescription(request.getDescription());
        if (request.getLifeArea() != null) {
            vision.setLifeArea(request.getLifeArea());
        }
        if (request.getColor() != null && !request.getColor().isBlank()) {
            vision.setColor(request.getColor());
        }
        if (request.getIcon() != null && !request.getIcon().isBlank()) {
            vision.setIcon(request.getIcon());
        }
        return visionRepository.save(vision);
    }

    public Vision updateVision(Long id, VisionRequest request) {
        Vision vision = getVisionById(id);
        if (request.getTitle() != null) vision.setTitle(request.getTitle());
        if (request.getDescription() != null) vision.setDescription(request.getDescription());
        if (request.getLifeArea() != null) vision.setLifeArea(request.getLifeArea());
        if (request.getColor() != null) vision.setColor(request.getColor());
        if (request.getIcon() != null) vision.setIcon(request.getIcon());
        return visionRepository.save(vision);
    }

    public void archiveVision(Long id) {
        Vision vision = getVisionById(id);
        vision.setArchived(true);
        visionRepository.save(vision);
    }

    public void unarchiveVision(Long id) {
        Vision vision = getVisionById(id);
        vision.setArchived(false);
        visionRepository.save(vision);
    }
}
