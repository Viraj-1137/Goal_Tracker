package com.focus.controller;

import com.focus.dto.VisionRequest;
import com.focus.model.Vision;
import com.focus.service.VisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visions")
@CrossOrigin(origins = "*")
public class VisionController {

    @Autowired
    private VisionService visionService;

    @GetMapping
    public ResponseEntity<List<Vision>> getAllVisions(@RequestParam(value = "all", defaultValue = "false") boolean all) {
        if (all) {
            return ResponseEntity.ok(visionService.getAllVisions());
        }
        return ResponseEntity.ok(visionService.getAllActiveVisions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vision> getVisionById(@PathVariable Long id) {
        return ResponseEntity.ok(visionService.getVisionById(id));
    }

    @PostMapping
    public ResponseEntity<Vision> createVision(@RequestBody VisionRequest request) {
        return ResponseEntity.ok(visionService.createVision(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vision> updateVision(@PathVariable Long id, @RequestBody VisionRequest request) {
        return ResponseEntity.ok(visionService.updateVision(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> archiveVision(@PathVariable Long id) {
        visionService.archiveVision(id);
        return ResponseEntity.ok(Map.of("message", "Vision archived successfully", "id", id));
    }
}
