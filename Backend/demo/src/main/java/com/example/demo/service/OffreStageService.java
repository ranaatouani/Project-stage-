package com.example.demo.service;

import com.example.demo.entity.OffreStage;
import com.example.demo.entity.ProjetStage;
import com.example.demo.entity.User;
import com.example.demo.repository.OffreStageRepository;
import com.example.demo.repository.ProjetStageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OffreStageService {

    private final OffreStageRepository offreStageRepository;
    private final ProjetStageRepository projetStageRepository;
    private final UserRepository userRepository;

    public OffreStageService(OffreStageRepository offreStageRepository,
                           ProjetStageRepository projetStageRepository,
                           UserRepository userRepository) {
        this.offreStageRepository = offreStageRepository;
        this.projetStageRepository = projetStageRepository;
        this.userRepository = userRepository;
    }

    // ===== CRUD Operations =====

    public OffreStage creerOffre(OffreStage offre, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent créer des offres");
        }

        offre.setCreatedBy(user);
        offre.setDateCreation(LocalDateTime.now());
        return offreStageRepository.save(offre);
    }

    public OffreStage creerOffreAvecProjet(OffreStage offre, ProjetStage projet, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent créer des offres");
        }

        // Sauvegarder d'abord le projet
        ProjetStage projetSauvegarde = projetStageRepository.save(projet);
        
        // Associer le projet à l'offre
        offre.setProjetStage(projetSauvegarde);
        offre.setCreatedBy(user);
        offre.setDateCreation(LocalDateTime.now());
        
        return offreStageRepository.save(offre);
    }

    public Optional<OffreStage> getOffreById(Long id) {
        return offreStageRepository.findById(id);
    }

    public List<OffreStage> getAllOffres() {
        return offreStageRepository.findAll();
    }

    public List<OffreStage> getOffresPubliees() {
        return offreStageRepository.findByEstPublieTrue();
    }

    public List<OffreStage> getOffresNonPubliees() {
        return offreStageRepository.findByEstPublieFalse();
    }

    public OffreStage modifierOffre(Long id, OffreStage offreModifiee, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent modifier des offres");
        }

        OffreStage offreExistante = offreStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Mettre à jour les champs
        offreExistante.setTitre(offreModifiee.getTitre());
        offreExistante.setDescription(offreModifiee.getDescription());
        offreExistante.setLocalisation(offreModifiee.getLocalisation());
        offreExistante.setDureeSemaines(offreModifiee.getDureeSemaines());
        offreExistante.setEntreprise(offreModifiee.getEntreprise());
        offreExistante.setContactEmail(offreModifiee.getContactEmail());
        offreExistante.setSalaireMensuel(offreModifiee.getSalaireMensuel());
        offreExistante.setDateModification(LocalDateTime.now());

        return offreStageRepository.save(offreExistante);
    }

    public void supprimerOffre(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent supprimer des offres");
        }

        OffreStage offre = offreStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offreStageRepository.delete(offre);
    }

    // ===== Publication Operations =====

    public OffreStage publierOffre(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent publier des offres");
        }

        OffreStage offre = offreStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offre.publier();
        return offreStageRepository.save(offre);
    }

    public OffreStage depublierOffre(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent dépublier des offres");
        }

        OffreStage offre = offreStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offre.depublier();
        return offreStageRepository.save(offre);
    }

    // ===== Search Operations =====

    public List<OffreStage> rechercherOffres(String searchTerm) {
        return offreStageRepository.searchOffres(searchTerm);
    }

    public List<OffreStage> rechercherOffresPubliees(String searchTerm) {
        return offreStageRepository.searchOffresPubliees(searchTerm);
    }

    public List<OffreStage> getOffresParLocalisation(String localisation) {
        return offreStageRepository.findByLocalisationContainingIgnoreCase(localisation);
    }

    public List<OffreStage> getOffresPublieesParLocalisation(String localisation) {
        return offreStageRepository.findByEstPublieTrueAndLocalisationContainingIgnoreCase(localisation);
    }

    public List<OffreStage> getOffresParDuree(Integer dureeSemaines) {
        return offreStageRepository.findByDureeSemaines(dureeSemaines);
    }

    public List<OffreStage> getOffresPublieesParDuree(Integer dureeSemaines) {
        return offreStageRepository.findByEstPublieTrueAndDureeSemaines(dureeSemaines);
    }

    public List<OffreStage> getOffresRecentes() {
        LocalDateTime dateLimit = LocalDateTime.now().minusDays(30);
        return offreStageRepository.findRecentOffres(dateLimit);
    }

    public List<OffreStage> getOffresPublieesRecentes() {
        LocalDateTime dateLimit = LocalDateTime.now().minusDays(30);
        return offreStageRepository.findRecentOffresPubliees(dateLimit);
    }

    // ===== Statistics =====

    public long getNombreOffresPubliees() {
        return offreStageRepository.countByEstPublieTrue();
    }

    public long getNombreOffresNonPubliees() {
        return offreStageRepository.countByEstPublieFalse();
    }

    public long getNombreTotalOffres() {
        return offreStageRepository.count();
    }

    // ===== Utility Methods =====

    private boolean isAdmin(User user) {
        return user.getRole().name().equals("Admin");
    }
}
