package com.example.demo.Controller;

import com.example.demo.entity.Notification;
import com.example.demo.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);
    
    @Autowired
    private NotificationService notificationService;
    
    // Récupérer toutes les notifications de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<List<Notification>> getMesNotifications(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            
            List<Notification> notifications = notificationService.getNotificationsUtilisateur(authentication.getName());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des notifications: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Récupérer les notifications non lues
    @GetMapping("/non-lues")
    public ResponseEntity<List<Notification>> getNotificationsNonLues(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            
            List<Notification> notifications = notificationService.getNotificationsNonLues(authentication.getName());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des notifications non lues: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Compter les notifications non lues
    @GetMapping("/count-non-lues")
    public ResponseEntity<Map<String, Object>> getCountNotificationsNonLues(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            
            long count = notificationService.compterNotificationsNonLues(authentication.getName());
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du comptage des notifications non lues: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Marquer une notification comme lue
    @PutMapping("/{id}/marquer-lue")
    public ResponseEntity<Map<String, Object>> marquerCommeLue(
            @PathVariable Long id, 
            Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            
            notificationService.marquerCommeLue(id, authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marquée comme lue");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du marquage de la notification comme lue: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Marquer toutes les notifications comme lues
    @PutMapping("/marquer-toutes-lues")
    public ResponseEntity<Map<String, Object>> marquerToutesCommeLues(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            
            notificationService.marquerToutesCommeLues(authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Toutes les notifications ont été marquées comme lues");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du marquage de toutes les notifications comme lues: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
