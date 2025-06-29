package com.example.demo.Controller;

import com.example.demo.dto.StageDTO;
import com.example.demo.entity.Stage;
import com.example.demo.entity.StatutStage;
import com.example.demo.entity.User;
import com.example.demo.service.StageService;
import com.example.demo.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "http://localhost:5173")
public class StageController {
    
    private static final Logger logger = LoggerFactory.getLogger(StageController.class);
    
    @Autowired
    private StageService stageService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Créer un stage à partir d'une candidature acceptée (Admin seulement)
     */
    @PostMapping("/creer-depuis-candidature/{candidatureId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> creerStageDepuisCandidature(@PathVariable Long candidatureId) {
        try {
            logger.info("Création d'un stage pour la candidature {}", candidatureId);
            Stage stage = stageService.creerStageDepuisCandidature(candidatureId);
            return ResponseEntity.ok(stage);
        } catch (Exception e) {
            logger.error("Erreur lors de la création du stage", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Récupérer tous les stages (Admin seulement)
     */
    @GetMapping("/admin/tous")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllStages() {
        try {
            logger.info("Récupération de tous les stages");
            List<Stage> stages = stageService.getAllStages();
            logger.info("Nombre de stages récupérés: {}", stages.size());
            return ResponseEntity.ok(stages);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des stages", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Récupérer les stages en cours (Admin seulement)
     */
    @GetMapping("/admin/en-cours")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Stage>> getStagesEnCours() {
        try {
            List<Stage> stages = stageService.getStagesEnCours();
            return ResponseEntity.ok(stages);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des stages en cours", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer les stages terminés (Admin seulement)
     */
    @GetMapping("/admin/termines")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Stage>> getStagesTermines() {
        try {
            List<Stage> stages = stageService.getStagesTermines();
            return ResponseEntity.ok(stages);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des stages terminés", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Récupérer les statistiques des stages (Admin seulement)
     */
    @GetMapping("/admin/statistiques")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StageService.StageStats> getStageStats() {
        try {
            StageService.StageStats stats = stageService.getStageStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Changer le statut d'un stage (Admin seulement)
     */
    @PutMapping("/admin/{stageId}/statut")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changerStatutStage(
            @PathVariable Long stageId,
            @RequestBody Map<String, Object> request) {
        try {
            String statutStr = (String) request.get("statut");
            String commentaires = (String) request.get("commentaires");
            
            StatutStage nouveauStatut = StatutStage.valueOf(statutStr);
            Stage stage = stageService.changerStatutStage(stageId, nouveauStatut, commentaires);
            
            return ResponseEntity.ok(stage);
        } catch (Exception e) {
            logger.error("Erreur lors du changement de statut du stage", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Mettre à jour les dates d'un stage (Admin seulement)
     */
    @PutMapping("/admin/{stageId}/dates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> mettreAJourDatesStage(
            @PathVariable Long stageId,
            @RequestBody Map<String, String> request) {
        try {
            LocalDate dateDebut = request.get("dateDebut") != null ? 
                LocalDate.parse(request.get("dateDebut")) : null;
            LocalDate dateFin = request.get("dateFin") != null ? 
                LocalDate.parse(request.get("dateFin")) : null;
            
            Stage stage = stageService.mettreAJourDatesStage(stageId, dateDebut, dateFin);
            return ResponseEntity.ok(stage);
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour des dates du stage", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Récupérer mes stages (Client)
     */
    @GetMapping("/mes-stages")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getMesStages(Authentication authentication) {
        try {
            String email = authentication.getName(); // L'authentification utilise l'email
            logger.info("Récupération des stages pour l'utilisateur: {}", email);

            User user = userService.findByEmail(email);
            logger.info("Utilisateur trouvé: {} (ID: {})", user.getEmail(), user.getId());

            List<Stage> stages = stageService.getStagesByStagiaire(user);
            logger.info("Nombre de stages trouvés: {}", stages.size());

            return ResponseEntity.ok(stages);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des stages du client", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Récupérer un stage par ID
     */
    @GetMapping("/{stageId}")
    public ResponseEntity<?> getStageById(@PathVariable Long stageId, Authentication authentication) {
        try {
            logger.info("Récupération du stage ID: {}", stageId);

            Stage stage = stageService.getStageById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

            // Vérifier les permissions
            String email = authentication.getName(); // L'authentification utilise l'email
            User user = userService.findByEmail(email);

            // Admin peut voir tous les stages, Client seulement ses propres stages
            if (!user.getRole().name().equals("ADMIN") &&
                !stage.getStagiaire().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Accès refusé"));
            }

            logger.info("Stage récupéré avec succès: {}", stage.getOffreStage().getTitre());
            return ResponseEntity.ok(stage);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du stage", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Supprimer un stage (Admin seulement)
     */
    @DeleteMapping("/admin/{stageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerStage(@PathVariable Long stageId) {
        try {
            stageService.supprimerStage(stageId);
            return ResponseEntity.ok(Map.of("message", "Stage supprimé avec succès"));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du stage", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
