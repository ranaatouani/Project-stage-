package com.example.demo.service;

import com.example.demo.entity.ProjetStage;
import com.example.demo.entity.User;
import com.example.demo.repository.ProjetStageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjetStageService {

    private final ProjetStageRepository projetStageRepository;
    private final UserRepository userRepository;

    public ProjetStageService(ProjetStageRepository projetStageRepository,
                            UserRepository userRepository) {
        this.projetStageRepository = projetStageRepository;
        this.userRepository = userRepository;
    }

    // ===== CRUD Operations =====

    public ProjetStage creerProjet(ProjetStage projet, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent créer des projets");
        }

        return projetStageRepository.save(projet);
    }

    public Optional<ProjetStage> getProjetById(Long id) {
        return projetStageRepository.findById(id);
    }

    public List<ProjetStage> getAllProjets() {
        return projetStageRepository.findAll();
    }

    public List<ProjetStage> getProjetsNonAssocies() {
        return projetStageRepository.findProjetsNonAssocies();
    }

    public List<ProjetStage> getProjetsAvecOffresPubliees() {
        return projetStageRepository.findProjetsAvecOffresPubliees();
    }

    public ProjetStage modifierProjet(Long id, ProjetStage projetModifie, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent modifier des projets");
        }

        ProjetStage projetExistant = projetStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Mettre à jour les champs
        projetExistant.setTitre(projetModifie.getTitre());
        projetExistant.setDescription(projetModifie.getDescription());
        projetExistant.setTechnologiesUtilisees(projetModifie.getTechnologiesUtilisees());
        projetExistant.setObjectifs(projetModifie.getObjectifs());
        projetExistant.setCompetencesRequises(projetModifie.getCompetencesRequises());

        return projetStageRepository.save(projetExistant);
    }

    public void supprimerProjet(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!isAdmin(user)) {
            throw new RuntimeException("Seuls les administrateurs peuvent supprimer des projets");
        }

        ProjetStage projet = projetStageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        projetStageRepository.delete(projet);
    }

    // ===== Search Operations =====

    public List<ProjetStage> rechercherProjets(String searchTerm) {
        return projetStageRepository.searchProjets(searchTerm);
    }

    public List<ProjetStage> getProjetsParTitre(String titre) {
        return projetStageRepository.findByTitreContainingIgnoreCase(titre);
    }

    public List<ProjetStage> getProjetsParTechnologie(String technologie) {
        return projetStageRepository.findByTechnologiesUtiliseesContainingIgnoreCase(technologie);
    }

    public List<ProjetStage> getProjetsParCompetence(String competence) {
        return projetStageRepository.findByCompetencesRequisesContainingIgnoreCase(competence);
    }

    // ===== Statistics =====

    public long getNombreTotalProjets() {
        return projetStageRepository.count();
    }

    public long getNombreProjetsNonAssocies() {
        return projetStageRepository.findProjetsNonAssocies().size();
    }

    public long getNombreProjetsAvecOffresPubliees() {
        return projetStageRepository.findProjetsAvecOffresPubliees().size();
    }

    // ===== Utility Methods =====

    private boolean isAdmin(User user) {
        return user.getRole().name().equals("Admin");
    }
}
