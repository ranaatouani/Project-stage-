package com.example.demo.repository;

import com.example.demo.entity.Entretien;
import com.example.demo.entity.Candidature;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EntretienRepository extends JpaRepository<Entretien, Long> {

    // Trouver un entretien par candidature
    Optional<Entretien> findByCandidature(Candidature candidature);

    // Trouver les entretiens d'un candidat
    @Query("SELECT e FROM Entretien e WHERE e.candidature.candidat = :candidat ORDER BY e.dateEntretien ASC")
    List<Entretien> findByCandidat(@Param("candidat") User candidat);

    // Trouver les entretiens programmés pour une période donnée
    @Query("SELECT e FROM Entretien e WHERE e.dateEntretien BETWEEN :dateDebut AND :dateFin ORDER BY e.dateEntretien ASC")
    List<Entretien> findByDateEntretienBetween(@Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);

    // Trouver les entretiens d'aujourd'hui
    @Query("SELECT e FROM Entretien e WHERE DATE(e.dateEntretien) = CURRENT_DATE ORDER BY e.dateEntretien ASC")
    List<Entretien> findEntretiensAujourdhui();

    // Trouver les entretiens à venir
    @Query("SELECT e FROM Entretien e WHERE e.dateEntretien > :maintenant ORDER BY e.dateEntretien ASC")
    List<Entretien> findEntretiensAVenir(@Param("maintenant") LocalDateTime maintenant);

    // Trouver les entretiens d'un candidat à venir
    @Query("SELECT e FROM Entretien e WHERE e.candidature.candidat = :candidat AND e.dateEntretien > :maintenant ORDER BY e.dateEntretien ASC")
    List<Entretien> findEntretiensAVenirByCandidat(@Param("candidat") User candidat, @Param("maintenant") LocalDateTime maintenant);
}
