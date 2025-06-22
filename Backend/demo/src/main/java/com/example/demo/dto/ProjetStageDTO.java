package com.example.demo.dto;

public class ProjetStageDTO {
    private Long id;
    private String titre;
    private String description;
    private String technologiesUtilisees;
    private String objectifs;
    private String competencesRequises;

    // Constructeurs
    public ProjetStageDTO() {}

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
