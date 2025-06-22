package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "offre_stage")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OffreStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titre", nullable = false)
    @NotBlank(message = "Le titre de l'offre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;

    @Column(name = "description", columnDefinition = "TEXT")
    @NotBlank(message = "La description de l'offre est obligatoire")
    private String description;

    @Column(name = "localisation", nullable = false)
    @NotBlank(message = "La localisation est obligatoire")
    @Size(max = 100, message = "La localisation ne peut pas dépasser 100 caractères")
    private String localisation;

    @Column(name = "duree_semaines", nullable = false)
    @NotNull(message = "La durée est obligatoire")
    @Positive(message = "La durée doit être positive")
    private Integer dureeSemaines;

    @Column(name = "entreprise")
    @Size(max = 100, message = "Le nom de l'entreprise ne peut pas dépasser 100 caractères")
    private String entreprise;

    @Column(name = "contact_email")
    @Size(max = 100, message = "L'email de contact ne peut pas dépasser 100 caractères")
    private String contactEmail;

    @Column(name = "salaire_mensuel")
    private Double salaireMensuel;

    @Column(name = "est_publie", nullable = false)
    private boolean estPublie = false;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @Column(name = "date_publication")
    private LocalDateTime datePublication;

    // Relation avec ProjetStage (One-to-One)
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_stage_id", referencedColumnName = "id")
    @JsonManagedReference
    private ProjetStage projetStage;

    // Relation avec User (créateur de l'offre - Admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"tokens", "hibernateLazyInitializer", "handler"})
    private User createdBy;

    // Constructeurs
    public OffreStage() {
        this.dateCreation = LocalDateTime.now();
    }

    public OffreStage(String titre, String description, String localisation, Integer dureeSemaines) {
        this();
        this.titre = titre;
        this.description = description;
        this.localisation = localisation;
        this.dureeSemaines = dureeSemaines;
    }

    // Méthodes utilitaires
    public void publier() {
        this.estPublie = true;
        this.datePublication = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
    }

    public void depublier() {
        this.estPublie = false;
        this.datePublication = null;
        this.dateModification = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.dateModification = LocalDateTime.now();
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

    public boolean isEstPublie() {
        return estPublie;
    }

    public void setEstPublie(boolean estPublie) {
        this.estPublie = estPublie;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public LocalDateTime getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(LocalDateTime datePublication) {
        this.datePublication = datePublication;
    }

    public ProjetStage getProjetStage() {
        return projetStage;
    }

    public void setProjetStage(ProjetStage projetStage) {
        this.projetStage = projetStage;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "OffreStage{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", localisation='" + localisation + '\'' +
                ", dureeSemaines=" + dureeSemaines +
                ", entreprise='" + entreprise + '\'' +
                ", estPublie=" + estPublie +
                ", dateCreation=" + dateCreation +
                '}';
    }
}
