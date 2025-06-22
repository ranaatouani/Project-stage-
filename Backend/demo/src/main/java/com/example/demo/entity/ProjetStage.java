package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "projet_stage")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProjetStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titre", nullable = false)
    @NotBlank(message = "Le titre du projet est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;

    @Column(name = "description", columnDefinition = "TEXT")
    @NotBlank(message = "La description du projet est obligatoire")
    private String description;

    @Column(name = "technologies_utilisees")
    @Size(max = 500, message = "Les technologies ne peuvent pas dépasser 500 caractères")
    private String technologiesUtilisees;

    @Column(name = "objectifs", columnDefinition = "TEXT")
    private String objectifs;

    @Column(name = "competences_requises")
    @Size(max = 500, message = "Les compétences requises ne peuvent pas dépasser 500 caractères")
    private String competencesRequises;

    // Constructeurs
    public ProjetStage() {}

    public ProjetStage(String titre, String description) {
        this.titre = titre;
        this.description = description;
    }

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

    @Override
    public String toString() {
        return "ProjetStage{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", description='" + description + '\'' +
                ", technologiesUtilisees='" + technologiesUtilisees + '\'' +
                ", objectifs='" + objectifs + '\'' +
                ", competencesRequises='" + competencesRequises + '\'' +
                '}';
    }
}
