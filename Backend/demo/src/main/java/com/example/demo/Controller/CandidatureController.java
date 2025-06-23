package com.example.demo.Controller;

import com.example.demo.entity.Candidature;
import com.example.demo.entity.StatutCandidature;
import com.example.demo.service.CandidatureService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CandidatureController {

    private static final Logger logger = LoggerFactory.getLogger(CandidatureController.class);
    private final CandidatureService candidatureService;

    public CandidatureController(CandidatureService candidatureService) {
        this.candidatureService = candidatureService;
    }

    @PostMapping("/soumettre")
    public ResponseEntity<Map<String, Object>> soumettreCandidature(
            @RequestParam("offreStageId") Long offreStageId,
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("email") String email,
            @RequestParam("telephone") String telephone,
            @RequestParam("motivation") String motivation,
            @RequestParam(value = "cv", required = false) MultipartFile cvFile,
            Authentication authentication) {
        
        try {
            logger.info("Réception d'une candidature pour l'offre {} de {}", offreStageId, email);
            
            String username = authentication != null ? authentication.getName() : null;
            
            Candidature candidature = candidatureService.soumettreCandidature(
                offreStageId, nom, prenom, email, telephone, motivation, cvFile, username
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Candidature soumise avec succès");
            response.put("candidatureId", candidature.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la soumission de candidature: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/offre/{offreStageId}")
    public ResponseEntity<List<Candidature>> getCandidaturesPourOffre(@PathVariable Long offreStageId) {
        try {
            List<Candidature> candidatures = candidatureService.getCandidaturesPourOffre(offreStageId);
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des candidatures: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/mes-candidatures")
    public ResponseEntity<List<Candidature>> getMesCandidatures(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }

            List<Candidature> candidatures = candidatureService.getCandidaturesUtilisateur(authentication.getName());
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des candidatures utilisateur: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/toutes")
    public ResponseEntity<List<Candidature>> getToutesCandidatures() {
        try {
            List<Candidature> candidatures = candidatureService.getToutesCandidatures();
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de toutes les candidatures: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidature> getCandidatureById(@PathVariable Long id) {
        try {
            Candidature candidature = candidatureService.getCandidatureById(id);
            return ResponseEntity.ok(candidature);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de la candidature: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Map<String, Object>> changerStatutCandidature(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String statutStr = request.get("statut");
            StatutCandidature statut = StatutCandidature.valueOf(statutStr);
            
            Candidature candidature = candidatureService.changerStatutCandidature(id, statut);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut mis à jour avec succès");
            response.put("candidature", candidature);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors du changement de statut: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> supprimerCandidature(@PathVariable Long id) {
        try {
            candidatureService.supprimerCandidature(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Candidature supprimée avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression de candidature: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<Candidature>> rechercherCandidatures(@RequestParam String q) {
        try {
            List<Candidature> candidatures = candidatureService.rechercherCandidatures(q);
            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de candidatures: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiquesCandidatures() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            List<Candidature> toutes = candidatureService.getToutesCandidatures();
            stats.put("total", toutes.size());
            
            long enAttente = toutes.stream().mapToLong(c -> 
                c.getStatut() == StatutCandidature.EN_ATTENTE ? 1 : 0).sum();
            stats.put("enAttente", enAttente);
            
            long acceptees = toutes.stream().mapToLong(c -> 
                c.getStatut() == StatutCandidature.ACCEPTEE ? 1 : 0).sum();
            stats.put("acceptees", acceptees);
            
            long refusees = toutes.stream().mapToLong(c -> 
                c.getStatut() == StatutCandidature.REFUSEE ? 1 : 0).sum();
            stats.put("refusees", refusees);
            
            List<Candidature> recentes = candidatureService.getCandidaturesRecentes();
            stats.put("recentes", recentes.size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
