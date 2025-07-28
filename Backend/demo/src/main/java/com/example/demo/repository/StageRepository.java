package com.example.demo.repository;

import com.example.demo.dto.StageDTO;
import com.example.demo.entity.Stage;
import com.example.demo.entity.StatutStage;
import com.example.demo.entity.User;
import com.example.demo.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {
    
    // Trouver un stage par candidature
    Optional<Stage> findByCandidatureId(Long candidatureId);

    // Trouver un stage par candidature (entité)
    Optional<Stage> findByCandidature(Candidature candidature);
    
    // Trouver tous les stages d'un stagiaire
    List<Stage> findByStagiaireOrderByDateCreationDesc(User stagiaire);
    
    // Trouver les stages par statut
    List<Stage> findByStatutOrderByDateCreationDesc(StatutStage statut);
    
    // Trouver tous les stages ordonnés par date de création
    List<Stage> findAllByOrderByDateCreationDesc();
    
    // Trouver les stages en cours
    @Query("SELECT s FROM Stage s WHERE s.statut = 'EN_COURS' ORDER BY s.dateCreation DESC")
    List<Stage> findStagesEnCours();
    
    // Trouver les stages terminés
    @Query("SELECT s FROM Stage s WHERE s.statut = 'TERMINE' ORDER BY s.dateModification DESC")
    List<Stage> findStagesTermines();
    
    // Trouver les stages qui se terminent bientôt (dans les 7 prochains jours)
    @Query("SELECT s FROM Stage s WHERE s.statut = 'EN_COURS' AND s.dateFin BETWEEN :today AND :nextWeek ORDER BY s.dateFin ASC")
    List<Stage> findStagesSeTerminantBientot(@Param("today") LocalDate today, @Param("nextWeek") LocalDate nextWeek);
    
    // Compter les stages par statut
    long countByStatut(StatutStage statut);
    
    // Trouver les stages d'une offre spécifique
    @Query("SELECT s FROM Stage s WHERE s.offreStage.id = :offreId ORDER BY s.dateCreation DESC")
    List<Stage> findByOffreStageId(@Param("offreId") Long offreId);
    
    // Vérifier si un stagiaire a déjà un stage en cours
    @Query("SELECT COUNT(s) > 0 FROM Stage s WHERE s.stagiaire = :stagiaire AND s.statut = 'EN_COURS'")
    boolean hasStagiaireStageEnCours(@Param("stagiaire") User stagiaire);

    // Requête optimisée pour récupérer tous les stages avec leurs informations (pour admin)
    @Query("SELECT new com.example.demo.dto.StageDTO(" +
           "s.id, s.statut, s.dateDebut, s.dateFin, s.commentaires, s.dateCreation, s.dateModification, " +
           "u.id, u.lastName, u.firstName, u.email, '', " +
           "o.id, o.titre, o.description, o.localisation, o.dureeSemaines, o.entreprise, " +
           "c.id, c.dateCandidature) " +
           "FROM Stage s " +
           "JOIN s.stagiaire u " +
           "JOIN s.offreStage o " +
           "JOIN s.candidature c " +
           "ORDER BY s.dateCreation DESC")
    List<StageDTO> findAllStagesOptimized();

    // Requête optimisée pour récupérer les stages d'un stagiaire (pour client)
    @Query("SELECT new com.example.demo.dto.StageDTO(" +
           "s.id, s.statut, s.dateDebut, s.dateFin, s.commentaires, s.dateCreation, s.dateModification, " +
           "u.id, u.lastName, u.firstName, u.email, '', " +
           "o.id, o.titre, o.description, o.localisation, o.dureeSemaines, o.entreprise, " +
           "c.id, c.dateCandidature) " +
           "FROM Stage s " +
           "JOIN s.stagiaire u " +
           "JOIN s.offreStage o " +
           "JOIN s.candidature c " +
           "WHERE s.stagiaire = :stagiaire " +
           "ORDER BY s.dateCreation DESC")
    List<StageDTO> findStagesByStagiaireOptimized(@Param("stagiaire") User stagiaire);

    // Requête optimisée pour récupérer un stage par ID
    @Query("SELECT new com.example.demo.dto.StageDTO(" +
           "s.id, s.statut, s.dateDebut, s.dateFin, s.commentaires, s.dateCreation, s.dateModification, " +
           "u.id, u.lastName, u.firstName, u.email, '', " +
           "o.id, o.titre, o.description, o.localisation, o.dureeSemaines, o.entreprise, " +
           "c.id, c.dateCandidature) " +
           "FROM Stage s " +
           "JOIN s.stagiaire u " +
           "JOIN s.offreStage o " +
           "JOIN s.candidature c " +
           "WHERE s.id = :stageId")
    Optional<StageDTO> findStageByIdOptimized(@Param("stageId") Long stageId);
}
