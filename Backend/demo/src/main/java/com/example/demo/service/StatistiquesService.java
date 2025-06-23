package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.repository.OffreStageRepository;
import com.example.demo.repository.ProjetStageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
public class StatistiquesService {

    private final OffreStageRepository offreStageRepository;
    private final ProjetStageRepository projetStageRepository;
    private final UserRepository userRepository;

    public StatistiquesService(OffreStageRepository offreStageRepository, 
                              ProjetStageRepository projetStageRepository,
                              UserRepository userRepository) {
        this.offreStageRepository = offreStageRepository;
        this.projetStageRepository = projetStageRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getStatistiquesDashboard() {
        Map<String, Object> stats = new HashMap<>();
        
        // Statistiques générales
        stats.put("totalOffres", offreStageRepository.count());
        stats.put("offresPubliees", offreStageRepository.countByEstPublieTrue());
        stats.put("offresBrouillon", offreStageRepository.countByEstPublieFalse());
        stats.put("totalUtilisateurs", userRepository.count());
        stats.put("totalAdmins", userRepository.countByRole(Role.Admin));
        stats.put("totalClients", userRepository.countByRole(Role.Client));
        stats.put("totalProjets", projetStageRepository.count());
        
        // Statistiques récentes (derniers 7 jours)
        LocalDateTime septJoursAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        stats.put("offresRecentes", offreStageRepository.countByDateCreationAfter(septJoursAgo));
        stats.put("offresPublieesRecentes", offreStageRepository.countByDatePublicationAfter(septJoursAgo));
        
        // Statistiques du mois
        LocalDateTime debutMois = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        stats.put("offresCeMois", offreStageRepository.countByDateCreationAfter(debutMois));
        
        return stats;
    }

    public Map<String, Object> getStatistiquesOffres() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", offreStageRepository.count());
        stats.put("publiees", offreStageRepository.countByEstPublieTrue());
        stats.put("brouillon", offreStageRepository.countByEstPublieFalse());
        stats.put("avecProjet", offreStageRepository.countByProjetStageIsNotNull());
        stats.put("sansProjet", offreStageRepository.countByProjetStageIsNull());
        
        // Statistiques par localisation (top 5)
        // Note: Cette requête nécessiterait une méthode personnalisée dans le repository
        
        return stats;
    }

    public Map<String, Object> getStatistiquesUtilisateurs() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", userRepository.count());
        stats.put("admins", userRepository.countByRole(Role.Admin));
        stats.put("clients", userRepository.countByRole(Role.Client));
        stats.put("actifs", userRepository.countByEnabledTrue());
        stats.put("inactifs", userRepository.countByEnabledFalse());
        
        return stats;
    }

    public Map<String, Object> getStatistiquesProjets() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", projetStageRepository.count());
        stats.put("avecOffre", offreStageRepository.countByProjetStageIsNotNull());
        stats.put("sansOffre", projetStageRepository.count() - offreStageRepository.countByProjetStageIsNotNull());
        
        return stats;
    }
}
