package com.example.demo.Controller;

import com.example.demo.entity.OffreStage;
import com.example.demo.entity.ProjetStage;
import com.example.demo.dto.OffreStageDTO;
import com.example.demo.mapper.OffreStageMapper;
import com.example.demo.service.OffreStageService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offres")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class OffreStageController {

    private static final Logger logger = LoggerFactory.getLogger(OffreStageController.class);
    private final OffreStageService offreStageService;
    private final OffreStageMapper offreStageMapper;

    public OffreStageController(OffreStageService offreStageService, OffreStageMapper offreStageMapper) {
        this.offreStageService = offreStageService;
        this.offreStageMapper = offreStageMapper;
    }

    // ===== CRUD Operations =====

    @PostMapping
    public ResponseEntity<?> creerOffre(@Valid @RequestBody OffreStage offre, Authentication authentication) {
        try {
            logger.info("Création d'une nouvelle offre par: {}", authentication.getName());
            OffreStage nouvelleOffre = offreStageService.creerOffre(offre, authentication.getName());
            OffreStageDTO offreDTO = offreStageMapper.toDTO(nouvelleOffre);
            return ResponseEntity.status(HttpStatus.CREATED).body(offreDTO);
        } catch (Exception e) {
            logger.error("Erreur lors de la création de l'offre: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/avec-projet")
    public ResponseEntity<?> creerOffreAvecProjet(
            @Valid @RequestBody Map<String, Object> request, 
            Authentication authentication) {
        try {
            logger.info("Création d'une offre avec projet par: {}", authentication.getName());
            
            // Extraire l'offre et le projet de la requête
            OffreStage offre = mapToOffreStage((Map<String, Object>) request.get("offre"));
            ProjetStage projet = mapToProjetStage((Map<String, Object>) request.get("projet"));
            
            OffreStage nouvelleOffre = offreStageService.creerOffreAvecProjet(offre, projet, authentication.getName());
            OffreStageDTO offreDTO = offreStageMapper.toDTO(nouvelleOffre);
            return ResponseEntity.status(HttpStatus.CREATED).body(offreDTO);
        } catch (Exception e) {
            logger.error("Erreur lors de la création de l'offre avec projet: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<OffreStageDTO>> getAllOffres() {
        logger.info("Récupération de toutes les offres");
        List<OffreStage> offres = offreStageService.getAllOffres();
        List<OffreStageDTO> offreDTOs = offres.stream()
                .map(offreStageMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offreDTOs);
    }

    @GetMapping("/publiees")
    public ResponseEntity<List<OffreStageDTO>> getOffresPubliees() {
        logger.info("Récupération des offres publiées");
        List<OffreStage> offres = offreStageService.getOffresPubliees();
        List<OffreStageDTO> offreDTOs = offres.stream()
                .map(offreStageMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offreDTOs);
    }

    @GetMapping("/non-publiees")
    public ResponseEntity<List<OffreStageDTO>> getOffresNonPubliees() {
        logger.info("Récupération des offres non publiées");
        List<OffreStage> offres = offreStageService.getOffresNonPubliees();
        List<OffreStageDTO> offreDTOs = offres.stream()
                .map(offreStageMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offreDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOffreById(@PathVariable Long id) {
        logger.info("Récupération de l'offre avec ID: {}", id);
        Optional<OffreStage> offre = offreStageService.getOffreById(id);
        if (offre.isPresent()) {
            OffreStageDTO offreDTO = offreStageMapper.toDTO(offre.get());
            return ResponseEntity.ok(offreDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modifierOffre(
            @PathVariable Long id, 
            @Valid @RequestBody OffreStage offre, 
            Authentication authentication) {
        try {
            logger.info("Modification de l'offre {} par: {}", id, authentication.getName());
            OffreStage offreModifiee = offreStageService.modifierOffre(id, offre, authentication.getName());
            return ResponseEntity.ok(offreModifiee);
        } catch (Exception e) {
            logger.error("Erreur lors de la modification de l'offre {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerOffre(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Suppression de l'offre {} par: {}", id, authentication.getName());
            offreStageService.supprimerOffre(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Offre supprimée avec succès"));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression de l'offre {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Publication Operations =====

    @PutMapping("/{id}/publier")
    public ResponseEntity<?> publierOffre(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Publication de l'offre {} par: {}", id, authentication.getName());
            OffreStage offre = offreStageService.publierOffre(id, authentication.getName());
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            logger.error("Erreur lors de la publication de l'offre {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/depublier")
    public ResponseEntity<?> depublierOffre(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Dépublication de l'offre {} par: {}", id, authentication.getName());
            OffreStage offre = offreStageService.depublierOffre(id, authentication.getName());
            return ResponseEntity.ok(offre);
        } catch (Exception e) {
            logger.error("Erreur lors de la dépublication de l'offre {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Search Operations =====

    @GetMapping("/recherche")
    public ResponseEntity<List<OffreStage>> rechercherOffres(@RequestParam String q) {
        logger.info("Recherche d'offres avec le terme: {}", q);
        List<OffreStage> offres = offreStageService.rechercherOffres(q);
        return ResponseEntity.ok(offres);
    }

    @GetMapping("/recherche/publiees")
    public ResponseEntity<List<OffreStage>> rechercherOffresPubliees(@RequestParam String q) {
        logger.info("Recherche d'offres publiées avec le terme: {}", q);
        List<OffreStage> offres = offreStageService.rechercherOffresPubliees(q);
        return ResponseEntity.ok(offres);
    }

    @GetMapping("/localisation/{localisation}")
    public ResponseEntity<List<OffreStage>> getOffresParLocalisation(@PathVariable String localisation) {
        logger.info("Récupération des offres pour la localisation: {}", localisation);
        List<OffreStage> offres = offreStageService.getOffresParLocalisation(localisation);
        return ResponseEntity.ok(offres);
    }

    @GetMapping("/duree/{duree}")
    public ResponseEntity<List<OffreStage>> getOffresParDuree(@PathVariable Integer duree) {
        logger.info("Récupération des offres pour la durée: {} semaines", duree);
        List<OffreStage> offres = offreStageService.getOffresParDuree(duree);
        return ResponseEntity.ok(offres);
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<OffreStage>> getOffresRecentes() {
        logger.info("Récupération des offres récentes");
        List<OffreStage> offres = offreStageService.getOffresRecentes();
        return ResponseEntity.ok(offres);
    }

    // ===== Statistics =====

    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Long>> getStatistiques() {
        logger.info("Récupération des statistiques des offres");
        Map<String, Long> stats = Map.of(
            "totalOffres", offreStageService.getNombreTotalOffres(),
            "offresPubliees", offreStageService.getNombreOffresPubliees(),
            "offresNonPubliees", offreStageService.getNombreOffresNonPubliees()
        );
        return ResponseEntity.ok(stats);
    }

    // ===== Utility Methods =====

    private OffreStage mapToOffreStage(Map<String, Object> map) {
        OffreStage offre = new OffreStage();
        offre.setTitre((String) map.get("titre"));
        offre.setDescription((String) map.get("description"));
        offre.setLocalisation((String) map.get("localisation"));
        offre.setDureeSemaines((Integer) map.get("dureeSemaines"));
        offre.setEntreprise((String) map.get("entreprise"));
        offre.setContactEmail((String) map.get("contactEmail"));
        if (map.get("salaireMensuel") != null) {
            offre.setSalaireMensuel(((Number) map.get("salaireMensuel")).doubleValue());
        }
        return offre;
    }

    private ProjetStage mapToProjetStage(Map<String, Object> map) {
        ProjetStage projet = new ProjetStage();
        projet.setTitre((String) map.get("titre"));
        projet.setDescription((String) map.get("description"));
        projet.setTechnologiesUtilisees((String) map.get("technologiesUtilisees"));
        projet.setObjectifs((String) map.get("objectifs"));
        projet.setCompetencesRequises((String) map.get("competencesRequises"));
        return projet;
    }
}
