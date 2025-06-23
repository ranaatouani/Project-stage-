package com.example.demo.Controller;

import com.example.demo.service.StatistiquesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistiques")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StatistiquesController {

    private static final Logger logger = LoggerFactory.getLogger(StatistiquesController.class);
    private final StatistiquesService statistiquesService;

    public StatistiquesController(StatistiquesService statistiquesService) {
        this.statistiquesService = statistiquesService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStatistiquesDashboard(Authentication authentication) {
        try {
            logger.info("Récupération des statistiques du dashboard par: {}", authentication.getName());
            Map<String, Object> statistiques = statistiquesService.getStatistiquesDashboard();
            return ResponseEntity.ok(statistiques);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/offres")
    public ResponseEntity<Map<String, Object>> getStatistiquesOffres(Authentication authentication) {
        try {
            logger.info("Récupération des statistiques des offres par: {}", authentication.getName());
            Map<String, Object> statistiques = statistiquesService.getStatistiquesOffres();
            return ResponseEntity.ok(statistiques);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques des offres: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/utilisateurs")
    public ResponseEntity<Map<String, Object>> getStatistiquesUtilisateurs(Authentication authentication) {
        try {
            logger.info("Récupération des statistiques des utilisateurs par: {}", authentication.getName());
            Map<String, Object> statistiques = statistiquesService.getStatistiquesUtilisateurs();
            return ResponseEntity.ok(statistiques);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques des utilisateurs: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/projets")
    public ResponseEntity<Map<String, Object>> getStatistiquesProjets(Authentication authentication) {
        try {
            logger.info("Récupération des statistiques des projets par: {}", authentication.getName());
            Map<String, Object> statistiques = statistiquesService.getStatistiquesProjets();
            return ResponseEntity.ok(statistiques);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des statistiques des projets: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
