package com.example.demo.Controller;

import com.example.demo.entity.Entretien;
import com.example.demo.entity.TypeEntretien;
import com.example.demo.service.EntretienService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/entretiens")
@CrossOrigin(origins = "http://localhost:3000")
public class EntretienController {

    private static final Logger logger = LoggerFactory.getLogger(EntretienController.class);

    @Autowired
    private EntretienService entretienService;

    // Programmer un entretien
    @PostMapping("/programmer")
    public ResponseEntity<?> programmerEntretien(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            Long candidatureId = Long.valueOf(request.get("candidatureId").toString());
            String dateEntretienStr = request.get("dateEntretien").toString();
            String lieu = request.get("lieu").toString();
            TypeEntretien typeEntretien = TypeEntretien.valueOf(request.get("typeEntretien").toString());
            String lienVisio = request.get("lienVisio") != null ? request.get("lienVisio").toString() : null;
            String commentaires = request.get("commentaires") != null ? request.get("commentaires").toString() : null;

            // Parser la date
            LocalDateTime dateEntretien = LocalDateTime.parse(dateEntretienStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            logger.info("Programmation d'un entretien pour la candidature {} par {}", candidatureId, authentication.getName());

            Entretien entretien = entretienService.programmerEntretien(
                candidatureId, dateEntretien, lieu, typeEntretien, lienVisio, commentaires, authentication.getName()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(entretien);
        } catch (Exception e) {
            logger.error("Erreur lors de la programmation de l'entretien: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Modifier un entretien
    @PutMapping("/{id}")
    public ResponseEntity<?> modifierEntretien(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            String dateEntretienStr = request.get("dateEntretien").toString();
            String lieu = request.get("lieu").toString();
            TypeEntretien typeEntretien = TypeEntretien.valueOf(request.get("typeEntretien").toString());
            String lienVisio = request.get("lienVisio") != null ? request.get("lienVisio").toString() : null;
            String commentaires = request.get("commentaires") != null ? request.get("commentaires").toString() : null;

            LocalDateTime dateEntretien = LocalDateTime.parse(dateEntretienStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            Entretien entretien = entretienService.modifierEntretien(
                id, dateEntretien, lieu, typeEntretien, lienVisio, commentaires, authentication.getName()
            );

            return ResponseEntity.ok(entretien);
        } catch (Exception e) {
            logger.error("Erreur lors de la modification de l'entretien: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Supprimer un entretien
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerEntretien(@PathVariable Long id, Authentication authentication) {
        try {
            entretienService.supprimerEntretien(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Entretien supprimé avec succès"));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression de l'entretien: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer un entretien par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEntretienById(@PathVariable Long id) {
        try {
            Optional<Entretien> entretien = entretienService.getEntretienById(id);
            if (entretien.isPresent()) {
                return ResponseEntity.ok(entretien.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'entretien: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer l'entretien d'une candidature
    @GetMapping("/candidature/{candidatureId}")
    public ResponseEntity<?> getEntretienByCandidature(@PathVariable Long candidatureId) {
        try {
            Optional<Entretien> entretien = entretienService.getEntretienByCandidature(candidatureId);
            if (entretien.isPresent()) {
                return ResponseEntity.ok(entretien.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'entretien: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer les entretiens d'un candidat (pour le client)
    @GetMapping("/mes-entretiens")
    public ResponseEntity<?> getMesEntretiens(Authentication authentication) {
        try {
            List<Entretien> entretiens = entretienService.getEntretiensByCandidat(authentication.getName());
            return ResponseEntity.ok(entretiens);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des entretiens: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer les entretiens à venir d'un candidat
    @GetMapping("/mes-entretiens/a-venir")
    public ResponseEntity<?> getMesEntretiensAVenir(Authentication authentication) {
        try {
            List<Entretien> entretiens = entretienService.getEntretiensAVenirByCandidat(authentication.getName());
            return ResponseEntity.ok(entretiens);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des entretiens à venir: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer tous les entretiens à venir (pour les admins)
    @GetMapping("/a-venir")
    public ResponseEntity<?> getEntretiensAVenir() {
        try {
            List<Entretien> entretiens = entretienService.getEntretiensAVenir();
            return ResponseEntity.ok(entretiens);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des entretiens à venir: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Récupérer les entretiens d'aujourd'hui (pour les admins)
    @GetMapping("/aujourd-hui")
    public ResponseEntity<?> getEntretiensAujourdhui() {
        try {
            List<Entretien> entretiens = entretienService.getEntretiensAujourdhui();
            return ResponseEntity.ok(entretiens);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des entretiens d'aujourd'hui: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
