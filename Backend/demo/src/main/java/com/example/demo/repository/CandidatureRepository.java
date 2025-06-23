package com.example.demo.repository;

import com.example.demo.entity.Candidature;
import com.example.demo.entity.OffreStage;
import com.example.demo.entity.StatutCandidature;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    // Trouver toutes les candidatures pour une offre
    List<Candidature> findByOffreStage(OffreStage offreStage);

    // Trouver toutes les candidatures pour une offre par ID
    List<Candidature> findByOffreStageId(Long offreStageId);

    // Trouver toutes les candidatures d'un utilisateur
    List<Candidature> findByCandidat(User candidat);

    // Trouver toutes les candidatures d'un utilisateur par ID
    List<Candidature> findByCandidatId(Long candidatId);

    // Trouver les candidatures par statut
    List<Candidature> findByStatut(StatutCandidature statut);

    // Trouver les candidatures par statut pour une offre
    List<Candidature> findByOffreStageAndStatut(OffreStage offreStage, StatutCandidature statut);

    // Vérifier si un utilisateur a déjà candidaté pour une offre
    Optional<Candidature> findByOffreStageAndCandidat(OffreStage offreStage, User candidat);

    // Vérifier si un email a déjà candidaté pour une offre
    Optional<Candidature> findByOffreStageAndEmail(OffreStage offreStage, String email);

    // Trouver les candidatures récentes (derniers 30 jours)
    @Query("SELECT c FROM Candidature c WHERE c.dateCandidature >= :dateLimit ORDER BY c.dateCandidature DESC")
    List<Candidature> findRecentCandidatures(@Param("dateLimit") LocalDateTime dateLimit);

    // Compter les candidatures par offre
    long countByOffreStage(OffreStage offreStage);

    // Compter les candidatures par offre et statut
    long countByOffreStageAndStatut(OffreStage offreStage, StatutCandidature statut);

    // Compter les candidatures par statut
    long countByStatut(StatutCandidature statut);

    // Trouver les candidatures par nom ou prénom
    @Query("SELECT c FROM Candidature c WHERE " +
           "LOWER(c.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Candidature> searchCandidatures(@Param("searchTerm") String searchTerm);

    // Trouver les candidatures dans une période donnée
    List<Candidature> findByDateCandidatureBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Trouver les candidatures ordonnées par date (plus récentes en premier)
    List<Candidature> findAllByOrderByDateCandidatureDesc();

    // Trouver les candidatures pour une offre ordonnées par date
    List<Candidature> findByOffreStageOrderByDateCandidatureDesc(OffreStage offreStage);
}
