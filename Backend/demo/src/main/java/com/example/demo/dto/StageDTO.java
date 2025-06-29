package com.example.demo.dto;

import com.example.demo.entity.StatutStage;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class StageDTO {
    private Long id;
    private StatutStage statut;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String commentaires;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    
    // Informations du stagiaire
    private Integer stagiaireId;      // User.id est Integer
    private String stagiaireNom;      // lastName de User
    private String stagiairePrenom;   // firstName de User
    private String stagiaireEmail;
    private String stagiaireTelephone;
    
    // Informations de l'offre
    private Long offreStageId;
    private String offreTitre;
    private String offreDescription;
    private String offreLocalisation;
    private Integer offreDureeSemaines;
    private String offreEntreprise;
    
    // Informations de candidature
    private Long candidatureId;
    private LocalDateTime candidatureDateCandidature;
    
    // Constructeurs
    public StageDTO() {}
    
    public StageDTO(Long id, StatutStage statut, LocalDate dateDebut, LocalDate dateFin,
                   String commentaires, LocalDateTime dateCreation, LocalDateTime dateModification,
                   Integer stagiaireId, String stagiaireNom, String stagiairePrenom, String stagiaireEmail, String stagiaireTelephone,
                   Long offreStageId, String offreTitre, String offreDescription, String offreLocalisation,
                   Integer offreDureeSemaines, String offreEntreprise,
                   Long candidatureId, LocalDateTime candidatureDateCandidature) {
        this.id = id;
        this.statut = statut;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.commentaires = commentaires;
        this.dateCreation = dateCreation;
        this.dateModification = dateModification;
        this.stagiaireId = stagiaireId;
        this.stagiaireNom = stagiaireNom;
        this.stagiairePrenom = stagiairePrenom;
        this.stagiaireEmail = stagiaireEmail;
        this.stagiaireTelephone = stagiaireTelephone;
        this.offreStageId = offreStageId;
        this.offreTitre = offreTitre;
        this.offreDescription = offreDescription;
        this.offreLocalisation = offreLocalisation;
        this.offreDureeSemaines = offreDureeSemaines;
        this.offreEntreprise = offreEntreprise;
        this.candidatureId = candidatureId;
        this.candidatureDateCandidature = candidatureDateCandidature;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public StatutStage getStatut() { return statut; }
    public void setStatut(StatutStage statut) { this.statut = statut; }
    
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    
    public String getCommentaires() { return commentaires; }
    public void setCommentaires(String commentaires) { this.commentaires = commentaires; }
    
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    
    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }
    
    public Integer getStagiaireId() { return stagiaireId; }
    public void setStagiaireId(Integer stagiaireId) { this.stagiaireId = stagiaireId; }
    
    public String getStagiaireNom() { return stagiaireNom; }
    public void setStagiaireNom(String stagiaireNom) { this.stagiaireNom = stagiaireNom; }
    
    public String getStagiairePrenom() { return stagiairePrenom; }
    public void setStagiairePrenom(String stagiairePrenom) { this.stagiairePrenom = stagiairePrenom; }
    
    public String getStagiaireEmail() { return stagiaireEmail; }
    public void setStagiaireEmail(String stagiaireEmail) { this.stagiaireEmail = stagiaireEmail; }
    
    public String getStagiaireTelephone() { return stagiaireTelephone; }
    public void setStagiaireTelephone(String stagiaireTelephone) { this.stagiaireTelephone = stagiaireTelephone; }
    
    public Long getOffreStageId() { return offreStageId; }
    public void setOffreStageId(Long offreStageId) { this.offreStageId = offreStageId; }
    
    public String getOffreTitre() { return offreTitre; }
    public void setOffreTitre(String offreTitre) { this.offreTitre = offreTitre; }
    
    public String getOffreDescription() { return offreDescription; }
    public void setOffreDescription(String offreDescription) { this.offreDescription = offreDescription; }
    
    public String getOffreLocalisation() { return offreLocalisation; }
    public void setOffreLocalisation(String offreLocalisation) { this.offreLocalisation = offreLocalisation; }
    
    public Integer getOffreDureeSemaines() { return offreDureeSemaines; }
    public void setOffreDureeSemaines(Integer offreDureeSemaines) { this.offreDureeSemaines = offreDureeSemaines; }
    
    public String getOffreEntreprise() { return offreEntreprise; }
    public void setOffreEntreprise(String offreEntreprise) { this.offreEntreprise = offreEntreprise; }
    
    public Long getCandidatureId() { return candidatureId; }
    public void setCandidatureId(Long candidatureId) { this.candidatureId = candidatureId; }
    
    public LocalDateTime getCandidatureDateCandidature() { return candidatureDateCandidature; }
    public void setCandidatureDateCandidature(LocalDateTime candidatureDateCandidature) { this.candidatureDateCandidature = candidatureDateCandidature; }
}
