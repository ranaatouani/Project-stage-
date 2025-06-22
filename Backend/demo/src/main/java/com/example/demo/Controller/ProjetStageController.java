package com.example.demo.Controller;

import com.example.demo.entity.ProjetStage;
import com.example.demo.service.ProjetStageService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ProjetStageController {

    private static final Logger logger = LoggerFactory.getLogger(ProjetStageController.class);
    private final ProjetStageService projetStageService;

    public ProjetStageController(ProjetStageService projetStageService) {
        this.projetStageService = projetStageService;
    }

    // ===== CRUD Operations =====

    @PostMapping
    public ResponseEntity<?> creerProjet(@Valid @RequestBody ProjetStage projet, Authentication authentication) {
        try {
            logger.info("Création d'un nouveau projet par: {}", authentication.getName());
            ProjetStage nouveauProjet = projetStageService.creerProjet(projet, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(nouveauProjet);
        } catch (Exception e) {
            logger.error("Erreur lors de la création du projet: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ProjetStage>> getAllProjets() {
        logger.info("Récupération de tous les projets");
        List<ProjetStage> projets = projetStageService.getAllProjets();
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/non-associes")
    public ResponseEntity<List<ProjetStage>> getProjetsNonAssocies() {
        logger.info("Récupération des projets non associés à des offres");
        List<ProjetStage> projets = projetStageService.getProjetsNonAssocies();
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/avec-offres-publiees")
    public ResponseEntity<List<ProjetStage>> getProjetsAvecOffresPubliees() {
        logger.info("Récupération des projets avec offres publiées");
        List<ProjetStage> projets = projetStageService.getProjetsAvecOffresPubliees();
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjetById(@PathVariable Long id) {
        logger.info("Récupération du projet avec ID: {}", id);
        Optional<ProjetStage> projet = projetStageService.getProjetById(id);
        if (projet.isPresent()) {
            return ResponseEntity.ok(projet.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modifierProjet(
            @PathVariable Long id, 
            @Valid @RequestBody ProjetStage projet, 
            Authentication authentication) {
        try {
            logger.info("Modification du projet {} par: {}", id, authentication.getName());
            ProjetStage projetModifie = projetStageService.modifierProjet(id, projet, authentication.getName());
            return ResponseEntity.ok(projetModifie);
        } catch (Exception e) {
            logger.error("Erreur lors de la modification du projet {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerProjet(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Suppression du projet {} par: {}", id, authentication.getName());
            projetStageService.supprimerProjet(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Projet supprimé avec succès"));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du projet {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Search Operations =====

    @GetMapping("/recherche")
    public ResponseEntity<List<ProjetStage>> rechercherProjets(@RequestParam String q) {
        logger.info("Recherche de projets avec le terme: {}", q);
        List<ProjetStage> projets = projetStageService.rechercherProjets(q);
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/titre/{titre}")
    public ResponseEntity<List<ProjetStage>> getProjetsParTitre(@PathVariable String titre) {
        logger.info("Récupération des projets par titre: {}", titre);
        List<ProjetStage> projets = projetStageService.getProjetsParTitre(titre);
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/technologie/{technologie}")
    public ResponseEntity<List<ProjetStage>> getProjetsParTechnologie(@PathVariable String technologie) {
        logger.info("Récupération des projets par technologie: {}", technologie);
        List<ProjetStage> projets = projetStageService.getProjetsParTechnologie(technologie);
        return ResponseEntity.ok(projets);
    }

    @GetMapping("/competence/{competence}")
    public ResponseEntity<List<ProjetStage>> getProjetsParCompetence(@PathVariable String competence) {
        logger.info("Récupération des projets par compétence: {}", competence);
        List<ProjetStage> projets = projetStageService.getProjetsParCompetence(competence);
        return ResponseEntity.ok(projets);
    }

    // ===== Statistics =====

    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Long>> getStatistiques() {
        logger.info("Récupération des statistiques des projets");
        Map<String, Long> stats = Map.of(
            "totalProjets", projetStageService.getNombreTotalProjets(),
            "projetsNonAssocies", projetStageService.getNombreProjetsNonAssocies(),
            "projetsAvecOffresPubliees", projetStageService.getNombreProjetsAvecOffresPubliees()
        );
        return ResponseEntity.ok(stats);
    }
}
