package com.example.demo.repository;

import com.example.demo.entity.ProjetStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjetStageRepository extends JpaRepository<ProjetStage, Long> {

    // Recherche par titre
    List<ProjetStage> findByTitreContainingIgnoreCase(String titre);

    // Recherche par technologies utilisées
    List<ProjetStage> findByTechnologiesUtiliseesContainingIgnoreCase(String technologie);

    // Recherche par compétences requises
    List<ProjetStage> findByCompetencesRequisesContainingIgnoreCase(String competence);

    // Recherche globale dans titre, description, technologies et compétences
    @Query("SELECT p FROM ProjetStage p WHERE " +
           "LOWER(p.titre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.technologiesUtilisees) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.competencesRequises) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<ProjetStage> searchProjets(@Param("searchTerm") String searchTerm);

    // Trouver les projets qui ne sont pas encore associés à une offre
    @Query("SELECT p FROM ProjetStage p WHERE p.id NOT IN " +
           "(SELECT o.projetStage.id FROM OffreStage o WHERE o.projetStage IS NOT NULL)")
    List<ProjetStage> findProjetsNonAssocies();

    // Trouver les projets associés à des offres publiées
    @Query("SELECT p FROM ProjetStage p JOIN OffreStage o ON p.id = o.projetStage.id WHERE o.estPublie = true")
    List<ProjetStage> findProjetsAvecOffresPubliees();
}
