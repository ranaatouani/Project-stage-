package com.example.demo.service;

import com.example.demo.dto.StageDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.StageRepository;
import com.example.demo.repository.CandidatureRepository;
import com.example.demo.repository.ProjetStageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StageService {
    
    private static final Logger logger = LoggerFactory.getLogger(StageService.class);
    
    @Autowired
    private StageRepository stageRepository;
    
    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private ProjetStageRepository projetStageRepository;

    @Autowired
    private NotificationService notificationService;
    
    /**
     * Créer un stage à partir d'une candidature acceptée
     */
    public Stage creerStageDepuisCandidature(Long candidatureId) {
        logger.info("Création d'un stage pour la candidature {}", candidatureId);
        
        Candidature candidature = candidatureRepository.findById(candidatureId)
            .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
        
        if (candidature.getStatut() != StatutCandidature.ACCEPTEE) {
            throw new RuntimeException("La candidature doit être acceptée pour créer un stage");
        }
        
        // Vérifier qu'il n'y a pas déjà un stage pour cette candidature
        Optional<Stage> stageExistant = stageRepository.findByCandidatureId(candidatureId);
        if (stageExistant.isPresent()) {
            logger.warn("Un stage existe déjà pour la candidature {}", candidatureId);
            return stageExistant.get();
        }
        
        // Créer le nouveau stage avec les informations de l'offre
        Stage stage = new Stage(candidature, candidature.getCandidat(), candidature.getOffreStage());

        // Définir les dates par défaut (à partir de maintenant pour 3 mois)
        stage.setDateDebut(LocalDate.now());
        stage.setDateFin(LocalDate.now().plusMonths(3));
        
        Stage savedStage = stageRepository.save(stage);
        logger.info("Stage créé avec succès: {}", savedStage);
        
        // Envoyer une notification au stagiaire
        try {
            notificationService.envoyerNotificationStage(savedStage, "STAGE_COMMENCE");
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de la notification de stage", e);
            // Ne pas faire échouer la création du stage si la notification échoue
        }
        
        return savedStage;
    }

    /**
     * Créer un stage à partir d'une candidature acceptée avec projet assigné
     */
    public Stage creerStageDepuisCandidatureAvecProjet(Long candidatureId, Long projetId,
                                                       LocalDate dateDebut, LocalDate dateFin,
                                                       String commentaires) {
        logger.info("Création d'un stage pour la candidature {} avec projet {}", candidatureId, projetId);

        Candidature candidature = candidatureRepository.findById(candidatureId)
            .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        ProjetStage projet = projetStageRepository.findById(projetId)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Vérifier qu'un stage n'existe pas déjà pour cette candidature
        Optional<Stage> stageExistant = stageRepository.findByCandidature(candidature);
        if (stageExistant.isPresent()) {
            logger.warn("Un stage existe déjà pour la candidature {}", candidatureId);
            return stageExistant.get();
        }

        // Créer le stage
        Stage stage = new Stage(candidature, candidature.getCandidat(), candidature.getOffreStage());
        stage.setProjetStage(projet);
        stage.setDateDebut(dateDebut);
        stage.setDateFin(dateFin);
        stage.setCommentaires(commentaires);
        stage.setStatut(StatutStage.EN_COURS);

        Stage savedStage = stageRepository.save(stage);
        logger.info("Stage créé avec succès: {}", savedStage.getId());

        // Envoyer une notification au stagiaire
        try {
            notificationService.creerNotificationNouveauStage(savedStage);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de la notification de stage", e);
            // Ne pas faire échouer la création du stage si la notification échoue
        }

        return savedStage;
    }

    /**
     * Récupérer tous les stages - Version complète si nécessaire
     */
    public List<Stage> getAllStages() {
        return stageRepository.findAllByOrderByDateCreationDesc();
    }

    /**
     * Récupérer les stages d'un stagiaire - Version complète
     */
    public List<Stage> getStagesByStagiaire(User stagiaire) {
        return stageRepository.findByStagiaireOrderByDateCreationDesc(stagiaire);
    }

    /**
     * Récupérer un stage par ID - Version complète
     */
    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findById(id);
    }
    
    /**
     * Changer le statut d'un stage
     */
    public Stage changerStatutStage(Long stageId, StatutStage nouveauStatut, String commentaires) {
        logger.info("Changement de statut du stage {} vers {}", stageId, nouveauStatut);
        
        Stage stage = stageRepository.findById(stageId)
            .orElseThrow(() -> new RuntimeException("Stage non trouvé"));
        
        StatutStage ancienStatut = stage.getStatut();
        stage.setStatut(nouveauStatut);
        stage.setDateModification(LocalDateTime.now());
        
        if (commentaires != null && !commentaires.trim().isEmpty()) {
            stage.setCommentaires(commentaires);
        }
        
        // Si le stage est terminé, définir la date de fin
        if (nouveauStatut == StatutStage.TERMINE && stage.getDateFin().isAfter(LocalDate.now())) {
            stage.setDateFin(LocalDate.now());
        }
        
        Stage savedStage = stageRepository.save(stage);
        logger.info("Statut du stage changé de {} vers {}", ancienStatut, nouveauStatut);
        
        // Envoyer une notification
        try {
            String typeNotification = switch (nouveauStatut) {
                case TERMINE -> "STAGE_TERMINE";
                case ANNULE -> "STAGE_ANNULE";
                case SUSPENDU -> "STAGE_SUSPENDU";
                default -> "STAGE_MODIFIE";
            };
            notificationService.envoyerNotificationStage(savedStage, typeNotification);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de la notification de changement de statut", e);
            // Ne pas faire échouer le changement de statut si la notification échoue
        }
        
        return savedStage;
    }
    
    /**
     * Mettre à jour les dates d'un stage
     */
    public Stage mettreAJourDatesStage(Long stageId, LocalDate dateDebut, LocalDate dateFin) {
        logger.info("Mise à jour des dates du stage {}", stageId);
        
        Stage stage = stageRepository.findById(stageId)
            .orElseThrow(() -> new RuntimeException("Stage non trouvé"));
        
        if (dateDebut != null) {
            stage.setDateDebut(dateDebut);
        }
        if (dateFin != null) {
            stage.setDateFin(dateFin);
        }
        
        stage.setDateModification(LocalDateTime.now());
        
        return stageRepository.save(stage);
    }
    
    /**
     * Récupérer les stages en cours
     */
    public List<Stage> getStagesEnCours() {
        return stageRepository.findStagesEnCours();
    }
    
    /**
     * Récupérer les stages terminés
     */
    public List<Stage> getStagesTermines() {
        return stageRepository.findStagesTermines();
    }
    
    /**
     * Récupérer les stages se terminant bientôt
     */
    public List<Stage> getStagesSeTerminantBientot() {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        return stageRepository.findStagesSeTerminantBientot(today, nextWeek);
    }
    
    /**
     * Supprimer un stage
     */
    public void supprimerStage(Long stageId) {
        logger.info("Suppression du stage {}", stageId);
        
        Stage stage = stageRepository.findById(stageId)
            .orElseThrow(() -> new RuntimeException("Stage non trouvé"));
        
        stageRepository.delete(stage);
        logger.info("Stage {} supprimé avec succès", stageId);
    }
    
    /**
     * Obtenir les statistiques des stages
     */
    public StageStats getStageStats() {
        long enCours = stageRepository.countByStatut(StatutStage.EN_COURS);
        long termines = stageRepository.countByStatut(StatutStage.TERMINE);
        long annules = stageRepository.countByStatut(StatutStage.ANNULE);
        long suspendus = stageRepository.countByStatut(StatutStage.SUSPENDU);
        
        return new StageStats(enCours, termines, annules, suspendus);
    }
    
    // Classe interne pour les statistiques
    public static class StageStats {
        private final long enCours;
        private final long termines;
        private final long annules;
        private final long suspendus;
        
        public StageStats(long enCours, long termines, long annules, long suspendus) {
            this.enCours = enCours;
            this.termines = termines;
            this.annules = annules;
            this.suspendus = suspendus;
        }
        
        // Getters
        public long getEnCours() { return enCours; }
        public long getTermines() { return termines; }
        public long getAnnules() { return annules; }
        public long getSuspendus() { return suspendus; }
        public long getTotal() { return enCours + termines + annules + suspendus; }
    }
}
