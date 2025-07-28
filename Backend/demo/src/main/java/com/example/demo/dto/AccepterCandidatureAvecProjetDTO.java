package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class AccepterCandidatureAvecProjetDTO {

    @NotNull(message = "L'ID de la candidature est obligatoire")
    private Long candidatureId;

    // Informations du projet
    @NotBlank(message = "Le titre du projet est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titreProjet;

    @NotBlank(message = "La description du projet est obligatoire")
    private String descriptionProjet;

    @Size(max = 500, message = "Les technologies ne peuvent pas dépasser 500 caractères")
    private String technologiesUtilisees;

    private String objectifs;

    @Size(max = 500, message = "Les compétences requises ne peuvent pas dépasser 500 caractères")
    private String competencesRequises;

    // Informations du stage
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String commentaires;

    // Livrables attendus
    private String livrablesAttendus;

    // Constructeurs
    public AccepterCandidatureAvecProjetDTO() {}

    // Getters et Setters
    public Long getCandidatureId() {
        return candidatureId;
    }

    public void setCandidatureId(Long candidatureId) {
        this.candidatureId = candidatureId;
    }

    public String getTitreProjet() {
        return titreProjet;
    }

    public void setTitreProjet(String titreProjet) {
        this.titreProjet = titreProjet;
    }

    public String getDescriptionProjet() {
        return descriptionProjet;
    }

    public void setDescriptionProjet(String descriptionProjet) {
        this.descriptionProjet = descriptionProjet;
    }

    public String getTechnologiesUtilisees() {
        return technologiesUtilisees;
    }

    public void setTechnologiesUtilisees(String technologiesUtilisees) {
        this.technologiesUtilisees = technologiesUtilisees;
    }

    public String getObjectifs() {
        return objectifs;
    }

    public void setObjectifs(String objectifs) {
        this.objectifs = objectifs;
    }

    public String getCompetencesRequises() {
        return competencesRequises;
    }

    public void setCompetencesRequises(String competencesRequises) {
        this.competencesRequises = competencesRequises;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(String commentaires) {
        this.commentaires = commentaires;
    }

    public String getLivrablesAttendus() {
        return livrablesAttendus;
    }

    public void setLivrablesAttendus(String livrablesAttendus) {
        this.livrablesAttendus = livrablesAttendus;
    }

    @Override
    public String toString() {
        return "AccepterCandidatureAvecProjetDTO{" +
                "candidatureId=" + candidatureId +
                ", titreProjet='" + titreProjet + '\'' +
                ", descriptionProjet='" + descriptionProjet + '\'' +
                ", technologiesUtilisees='" + technologiesUtilisees + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                '}';
    }
}
