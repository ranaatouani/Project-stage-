package com.example.demo.Controller;

import com.example.demo.entity.Candidature;
import com.example.demo.entity.StatutCandidature;
import com.example.demo.service.CandidatureService;
import com.example.demo.dto.AccepterCandidatureAvecProjetDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

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
            logger.info("Tentative de récupération des candidatures pour l'utilisateur");

            if (authentication == null) {
                logger.warn("Authentication est null");
                return ResponseEntity.status(401).build();
            }

            String username = authentication.getName();
            logger.info("Utilisateur authentifié: {}", username);

            List<Candidature> candidatures = candidatureService.getCandidaturesUtilisateur(username);
            logger.info("Nombre de candidatures trouvées: {}", candidatures.size());

            return ResponseEntity.ok(candidatures);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des candidatures utilisateur: {}", e.getMessage(), e);
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

    @PostMapping("/accepter-avec-projet")
    public ResponseEntity<Map<String, Object>> accepterCandidatureAvecProjet(
            @Valid @RequestBody AccepterCandidatureAvecProjetDTO dto) {
        try {
            logger.info("Acceptation de la candidature {} avec assignation de projet", dto.getCandidatureId());

            Candidature candidature = candidatureService.accepterCandidatureAvecProjet(dto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Candidature acceptée et projet assigné avec succès");
            response.put("candidature", candidature);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de l'acceptation avec projet: {}", e.getMessage());
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

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> telechargerCV(@PathVariable Long id) {
        try {
            logger.info("Tentative de téléchargement du CV pour la candidature ID: {}", id);

            Candidature candidature = candidatureService.getCandidatureById(id);

            if (candidature.getCvPath() == null || candidature.getCvPath().isEmpty()) {
                logger.warn("Aucun CV trouvé pour la candidature ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(candidature.getCvPath());
            logger.info("Chemin du fichier CV (original): {}", candidature.getCvPath());
            logger.info("Chemin du fichier CV (absolu): {}", filePath.toAbsolutePath().toString());

            if (!Files.exists(filePath)) {
                logger.warn("Le fichier CV n'existe pas au chemin original: {}", filePath.toAbsolutePath().toString());

                // Essayons avec un chemin relatif depuis le dossier uploads
                String filename = candidature.getCvFilename();
                if (filename != null && !filename.isEmpty()) {
                    Path alternativePath = Paths.get("uploads/cv/" + filename);
                    logger.info("Tentative avec chemin alternatif: {}", alternativePath.toAbsolutePath().toString());

                    if (Files.exists(alternativePath)) {
                        filePath = alternativePath;
                        logger.info("Fichier trouvé avec chemin alternatif");
                    } else {
                        logger.error("Le fichier CV n'existe pas non plus au chemin alternatif: {}", alternativePath.toAbsolutePath().toString());
                        return ResponseEntity.notFound().build();
                    }
                } else {
                    logger.error("Aucun nom de fichier disponible pour essayer un chemin alternatif");
                    return ResponseEntity.notFound().build();
                }
            }

            Resource resource = new FileSystemResource(filePath);
            logger.info("Taille du fichier: {} bytes", Files.size(filePath));

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                String filename = candidature.getCvFilename();
                if (filename == null || filename.isEmpty()) {
                    filename = "CV_" + candidature.getNom() + "_" + candidature.getPrenom() + ".pdf";
                }

                logger.info("Téléchargement du CV réussi: {}", filename);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                logger.error("Le fichier CV n'est pas lisible: {}", filePath.toString());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors du téléchargement du CV pour la candidature ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // Endpoint de debug pour lister les fichiers CV (à supprimer en production)
    @GetMapping("/debug/cv-files")
    public ResponseEntity<Map<String, Object>> listCVFiles() {
        try {
            Map<String, Object> result = new HashMap<>();
            Path uploadDir = Paths.get("uploads/cv/");

            result.put("uploadDir", uploadDir.toAbsolutePath().toString());
            result.put("exists", Files.exists(uploadDir));

            if (Files.exists(uploadDir)) {
                List<String> files = Files.list(uploadDir)
                    .map(path -> path.getFileName().toString())
                    .collect(java.util.stream.Collectors.toList());
                result.put("files", files);
                result.put("fileCount", files.size());
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Erreur lors du listage des fichiers CV: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint de debug pour corriger les chemins CV (à supprimer en production)
    @PostMapping("/debug/fix-cv-paths")
    public ResponseEntity<Map<String, Object>> fixCVPaths() {
        try {
            List<Candidature> candidatures = candidatureService.getAllCandidatures();
            Map<String, Object> result = new HashMap<>();
            int fixed = 0;

            for (Candidature candidature : candidatures) {
                if (candidature.getCvPath() != null && candidature.getCvFilename() != null) {
                    String currentPath = candidature.getCvPath();
                    String expectedPath = "uploads/cv/" + candidature.getCvFilename();

                    // Si le chemin actuel est différent du chemin attendu
                    if (!currentPath.equals(expectedPath)) {
                        // Vérifier si le fichier existe avec le nouveau chemin
                        Path newPath = Paths.get(expectedPath);
                        if (Files.exists(newPath)) {
                            candidature.setCvPath(expectedPath);
                            candidatureService.saveCandidature(candidature);
                            fixed++;
                            logger.info("Chemin CV corrigé pour candidature {}: {} -> {}",
                                      candidature.getId(), currentPath, expectedPath);
                        }
                    }
                }
            }

            result.put("candidaturesFixed", fixed);
            result.put("message", "Chemins CV corrigés avec succès");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Erreur lors de la correction des chemins CV: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
