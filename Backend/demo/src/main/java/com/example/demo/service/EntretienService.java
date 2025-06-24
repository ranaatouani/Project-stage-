package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.EntretienRepository;
import com.example.demo.repository.CandidatureRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EntretienService {

    private static final Logger logger = LoggerFactory.getLogger(EntretienService.class);

    @Autowired
    private EntretienRepository entretienRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Programmer un entretien
    public Entretien programmerEntretien(Long candidatureId, LocalDateTime dateEntretien, 
                                       String lieu, TypeEntretien typeEntretien, 
                                       String lienVisio, String commentaires, String userEmail) {
        
        logger.info("Programmation d'un entretien pour la candidature {} par {}", candidatureId, userEmail);

        // Vérifier que l'utilisateur est admin
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent programmer des entretiens");
        }

        // Récupérer la candidature
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        // Vérifier qu'il n'y a pas déjà un entretien programmé
        Optional<Entretien> entretienExistant = entretienRepository.findByCandidature(candidature);
        if (entretienExistant.isPresent()) {
            throw new RuntimeException("Un entretien est déjà programmé pour cette candidature");
        }

        // Créer l'entretien
        Entretien entretien = new Entretien();
        entretien.setCandidature(candidature);
        entretien.setDateEntretien(dateEntretien);
        entretien.setLieu(lieu);
        entretien.setTypeEntretien(typeEntretien);
        entretien.setLienVisio(lienVisio);
        entretien.setCommentaires(commentaires);
        entretien.setCreatedBy(user);

        entretien = entretienRepository.save(entretien);

        // Changer le statut de la candidature à ENTRETIEN
        candidature.setStatut(StatutCandidature.ENTRETIEN);
        candidatureRepository.save(candidature);

        // Créer une notification pour le candidat
        try {
            notificationService.creerNotificationEntretienProgramme(candidature, entretien);
        } catch (Exception e) {
            logger.error("Erreur lors de la création de la notification d'entretien: {}", e.getMessage());
        }

        logger.info("Entretien programmé avec succès pour la candidature {}", candidatureId);
        return entretien;
    }

    // Modifier un entretien
    public Entretien modifierEntretien(Long entretienId, LocalDateTime dateEntretien, 
                                     String lieu, TypeEntretien typeEntretien, 
                                     String lienVisio, String commentaires, String userEmail) {
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent modifier des entretiens");
        }

        Entretien entretien = entretienRepository.findById(entretienId)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé"));

        entretien.setDateEntretien(dateEntretien);
        entretien.setLieu(lieu);
        entretien.setTypeEntretien(typeEntretien);
        entretien.setLienVisio(lienVisio);
        entretien.setCommentaires(commentaires);
        entretien.modifier();

        return entretienRepository.save(entretien);
    }

    // Supprimer un entretien
    public void supprimerEntretien(Long entretienId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent supprimer des entretiens");
        }

        Entretien entretien = entretienRepository.findById(entretienId)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé"));

        // Remettre la candidature en attente
        Candidature candidature = entretien.getCandidature();
        candidature.setStatut(StatutCandidature.EN_ATTENTE);
        candidatureRepository.save(candidature);

        entretienRepository.delete(entretien);
    }

    // Récupérer un entretien par ID
    public Optional<Entretien> getEntretienById(Long id) {
        return entretienRepository.findById(id);
    }

    // Récupérer l'entretien d'une candidature
    public Optional<Entretien> getEntretienByCandidature(Long candidatureId) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
        return entretienRepository.findByCandidature(candidature);
    }

    // Récupérer les entretiens d'un candidat
    public List<Entretien> getEntretiensByCandidat(String emailCandidat) {
        User candidat = userRepository.findByEmail(emailCandidat)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));
        return entretienRepository.findByCandidat(candidat);
    }

    // Récupérer les entretiens à venir d'un candidat
    public List<Entretien> getEntretiensAVenirByCandidat(String emailCandidat) {
        User candidat = userRepository.findByEmail(emailCandidat)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));
        return entretienRepository.findEntretiensAVenirByCandidat(candidat, LocalDateTime.now());
    }

    // Récupérer tous les entretiens à venir
    public List<Entretien> getEntretiensAVenir() {
        return entretienRepository.findEntretiensAVenir(LocalDateTime.now());
    }

    // Récupérer les entretiens d'aujourd'hui
    public List<Entretien> getEntretiensAujourdhui() {
        return entretienRepository.findEntretiensAujourdhui();
    }

    // Méthode utilitaire pour vérifier si l'utilisateur est admin
    private boolean isAdmin(User user) {
        return user.getRole().name().equals("Admin");
    }
}
