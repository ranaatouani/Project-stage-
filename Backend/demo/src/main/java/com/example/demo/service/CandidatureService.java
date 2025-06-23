package com.example.demo.service;

import com.example.demo.entity.Candidature;
import com.example.demo.entity.OffreStage;
import com.example.demo.entity.StatutCandidature;
import com.example.demo.entity.User;
import com.example.demo.repository.CandidatureRepository;
import com.example.demo.repository.OffreStageRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CandidatureService {

    private static final Logger logger = LoggerFactory.getLogger(CandidatureService.class);
    private static final String UPLOAD_DIR = "uploads/cv/";

    private final CandidatureRepository candidatureRepository;
    private final OffreStageRepository offreStageRepository;
    private final UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public CandidatureService(CandidatureRepository candidatureRepository,
                             OffreStageRepository offreStageRepository,
                             UserRepository userRepository) {
        this.candidatureRepository = candidatureRepository;
        this.offreStageRepository = offreStageRepository;
        this.userRepository = userRepository;
        
        // Créer le dossier d'upload s'il n'existe pas
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath);
            logger.info("Dossier d'upload CV créé/vérifié: {}", uploadPath.toAbsolutePath());
        } catch (IOException e) {
            logger.error("Erreur lors de la création du dossier d'upload: {}", e.getMessage());
        }
    }

    public Candidature soumettreCandidature(Long offreStageId, String nom, String prenom, 
                                          String email, String telephone, String motivation,
                                          MultipartFile cvFile, String username) {
        logger.info("Soumission d'une candidature pour l'offre {} par {}", offreStageId, email);

        // Vérifier que l'offre existe
        OffreStage offreStage = offreStageRepository.findById(offreStageId)
                .orElseThrow(() -> new RuntimeException("Offre de stage non trouvée"));

        // Vérifier que l'offre est publiée
        if (!offreStage.isEstPublie()) {
            throw new RuntimeException("Cette offre n'est plus disponible");
        }

        // Récupérer l'utilisateur si connecté
        User candidat = null;
        if (username != null) {
            candidat = userRepository.findByEmail(username)
                    .or(() -> userRepository.findByUsername(username))
                    .orElse(null);
        }

        // Vérifier si l'utilisateur n'a pas déjà candidaté
        if (candidat != null) {
            Optional<Candidature> existingCandidature = candidatureRepository
                    .findByOffreStageAndCandidat(offreStage, candidat);
            if (existingCandidature.isPresent()) {
                throw new RuntimeException("Vous avez déjà candidaté pour cette offre");
            }
        } else {
            // Vérifier par email si pas connecté
            Optional<Candidature> existingCandidature = candidatureRepository
                    .findByOffreStageAndEmail(offreStage, email);
            if (existingCandidature.isPresent()) {
                throw new RuntimeException("Une candidature avec cet email existe déjà pour cette offre");
            }
        }

        // Créer la candidature
        Candidature candidature = new Candidature(nom, prenom, email, telephone, motivation, offreStage, candidat);

        // Gérer l'upload du CV
        if (cvFile != null && !cvFile.isEmpty()) {
            try {
                String cvPath = saveCV(cvFile, candidature);
                candidature.setCvPath(cvPath);
                candidature.setCvFilename(cvFile.getOriginalFilename());
            } catch (IOException e) {
                logger.error("Erreur lors de l'upload du CV: {}", e.getMessage());
                throw new RuntimeException("Erreur lors de l'upload du CV: " + e.getMessage());
            }
        }

        candidature = candidatureRepository.save(candidature);
        logger.info("Candidature créée avec succès: {}", candidature.getId());

        // Créer une notification pour le candidat
        notificationService.creerNotificationNouvelleCandidature(candidature);

        return candidature;
    }

    private String saveCV(MultipartFile file, Candidature candidature) throws IOException {
        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + extension;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        Path filePath = uploadPath.resolve(filename);

        // Créer le dossier s'il n'existe pas
        Files.createDirectories(uploadPath);

        // Copier le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        logger.info("CV sauvegardé: {} -> {}", originalFilename, filePath.toAbsolutePath().toString());

        // Retourner le chemin relatif pour plus de portabilité
        String relativePath = UPLOAD_DIR + filename;
        logger.info("Chemin relatif sauvegardé: {}", relativePath);
        return relativePath;
    }

    public List<Candidature> getCandidaturesPourOffre(Long offreStageId) {
        OffreStage offreStage = offreStageRepository.findById(offreStageId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        return candidatureRepository.findByOffreStageOrderByDateCandidatureDesc(offreStage);
    }

    public Candidature saveCandidature(Candidature candidature) {
        return candidatureRepository.save(candidature);
    }

    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }

    public List<Candidature> getCandidaturesUtilisateur(String emailOrUsername) {
        logger.info("Recherche des candidatures pour l'utilisateur: {}", emailOrUsername);

        // Essayer d'abord par email, puis par username
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + emailOrUsername));

        logger.info("Utilisateur trouvé: {} (ID: {}, Email: {})", user.getUsername(), user.getId(), user.getEmail());

        List<Candidature> candidatures = candidatureRepository.findByCandidat(user);
        logger.info("Nombre de candidatures trouvées pour {}: {}", emailOrUsername, candidatures.size());

        return candidatures;
    }

    public List<Candidature> getToutesCandidatures() {
        return candidatureRepository.findAllByOrderByDateCandidatureDesc();
    }

    public Candidature getCandidatureById(Long id) {
        return candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
    }

    public Candidature changerStatutCandidature(Long candidatureId, StatutCandidature nouveauStatut) {
        Candidature candidature = getCandidatureById(candidatureId);
        StatutCandidature ancienStatut = candidature.getStatut();

        candidature.setStatut(nouveauStatut);
        candidature = candidatureRepository.save(candidature);

        // Créer une notification si le statut a changé
        if (ancienStatut != nouveauStatut) {
            try {
                notificationService.creerNotificationChangementStatut(candidature, ancienStatut);
            } catch (Exception e) {
                logger.error("Erreur lors de la création de la notification: {}", e.getMessage());
                // Ne pas faire échouer le changement de statut si la notification échoue
            }
        }

        return candidature;
    }

    public void supprimerCandidature(Long candidatureId) {
        Candidature candidature = getCandidatureById(candidatureId);
        
        // Supprimer le fichier CV s'il existe
        if (candidature.getCvPath() != null) {
            try {
                Files.deleteIfExists(Paths.get(candidature.getCvPath()));
            } catch (IOException e) {
                logger.warn("Impossible de supprimer le fichier CV: {}", e.getMessage());
            }
        }
        
        candidatureRepository.delete(candidature);
    }

    public long getNombreCandidaturesPourOffre(Long offreStageId) {
        OffreStage offreStage = offreStageRepository.findById(offreStageId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        return candidatureRepository.countByOffreStage(offreStage);
    }

    public List<Candidature> getCandidaturesRecentes() {
        LocalDateTime unMoisAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        return candidatureRepository.findRecentCandidatures(unMoisAgo);
    }

    public List<Candidature> rechercherCandidatures(String searchTerm) {
        return candidatureRepository.searchCandidatures(searchTerm);
    }
}
