package com.example.demo.repository;

import com.example.demo.entity.OffreStage;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {

    // Trouver toutes les offres publiées
    List<OffreStage> findByEstPublieTrue();

    // Trouver toutes les offres non publiées
    List<OffreStage> findByEstPublieFalse();

    // Trouver les offres par localisation
    List<OffreStage> findByLocalisationContainingIgnoreCase(String localisation);

    // Trouver les offres publiées par localisation
    List<OffreStage> findByEstPublieTrueAndLocalisationContainingIgnoreCase(String localisation);

    // Trouver les offres par durée
    List<OffreStage> findByDureeSemaines(Integer dureeSemaines);

    // Trouver les offres publiées par durée
    List<OffreStage> findByEstPublieTrueAndDureeSemaines(Integer dureeSemaines);

    // Trouver les offres par entreprise
    List<OffreStage> findByEntrepriseContainingIgnoreCase(String entreprise);

    // Trouver les offres créées par un utilisateur spécifique
    List<OffreStage> findByCreatedBy(User createdBy);

    // Trouver les offres créées dans une période donnée
    List<OffreStage> findByDateCreationBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Trouver les offres publiées dans une période donnée
    List<OffreStage> findByEstPublieTrueAndDatePublicationBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Recherche par titre (contient le texte)
    List<OffreStage> findByTitreContainingIgnoreCase(String titre);

    // Recherche publiée par titre
    List<OffreStage> findByEstPublieTrueAndTitreContainingIgnoreCase(String titre);

    // Recherche globale dans titre et description
    @Query("SELECT o FROM OffreStage o WHERE " +
           "LOWER(o.titre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.entreprise) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<OffreStage> searchOffres(@Param("searchTerm") String searchTerm);

    // Recherche globale dans les offres publiées seulement
    @Query("SELECT o FROM OffreStage o WHERE o.estPublie = true AND (" +
           "LOWER(o.titre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(o.entreprise) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<OffreStage> searchOffresPubliees(@Param("searchTerm") String searchTerm);

    // Trouver les offres avec projet de stage
    @Query("SELECT o FROM OffreStage o WHERE o.projetStage IS NOT NULL")
    List<OffreStage> findOffresWithProjet();

    // Trouver les offres publiées avec projet de stage
    @Query("SELECT o FROM OffreStage o WHERE o.estPublie = true AND o.projetStage IS NOT NULL")
    List<OffreStage> findOffresPublieesWithProjet();

    // Compter les offres publiées
    long countByEstPublieTrue();

    // Compter les offres non publiées
    long countByEstPublieFalse();

    // Trouver les offres récentes (derniers 30 jours)
    @Query("SELECT o FROM OffreStage o WHERE o.dateCreation >= :dateLimit ORDER BY o.dateCreation DESC")
    List<OffreStage> findRecentOffres(@Param("dateLimit") LocalDateTime dateLimit);

    // Trouver les offres publiées récentes
    @Query("SELECT o FROM OffreStage o WHERE o.estPublie = true AND o.dateCreation >= :dateLimit ORDER BY o.dateCreation DESC")
    List<OffreStage> findRecentOffresPubliees(@Param("dateLimit") LocalDateTime dateLimit);

    // Méthodes pour les statistiques
    long countByDateCreationAfter(LocalDateTime date);
    long countByDatePublicationAfter(LocalDateTime date);
    long countByProjetStageIsNotNull();
    long countByProjetStageIsNull();
}
