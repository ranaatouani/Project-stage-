package com.example.demo.dto;

import java.time.LocalDateTime;

public class OffreStageDTO {
    private Long id;
    private String titre;
    private String description;
    private String localisation;
    private Integer dureeSemaines;
    private String entreprise;
    private String contactEmail;
    private Double salaireMensuel;
    private boolean publie;
    private LocalDateTime dateCreation;
    private LocalDateTime datePublication;
    private ProjetStageDTO projetStage;
    private String createdByEmail;

    // Constructeurs
    public OffreStageDTO() {}

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

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public Integer getDureeSemaines() {
        return dureeSemaines;
    }

    public void setDureeSemaines(Integer dureeSemaines) {
        this.dureeSemaines = dureeSemaines;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }



    public Double getSalaireMensuel() {
        return salaireMensuel;
    }

    public void setSalaireMensuel(Double salaireMensuel) {
        this.salaireMensuel = salaireMensuel;
    }

    public boolean isPublie() {
        return publie;
    }

    public void setPublie(boolean publie) {
        this.publie = publie;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(LocalDateTime datePublication) {
        this.datePublication = datePublication;
    }

    public ProjetStageDTO getProjetStage() {
        return projetStage;
    }

    public void setProjetStage(ProjetStageDTO projetStage) {
        this.projetStage = projetStage;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }
}
