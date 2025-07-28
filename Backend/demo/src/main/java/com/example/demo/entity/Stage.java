package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stages")
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false)
    private Candidature candidature;

    @ManyToOne
    @JoinColumn(name = "stagiaire_id", nullable = false)
    private User stagiaire;

    @ManyToOne
    @JoinColumn(name = "offre_stage_id", nullable = false)
    private OffreStage offreStage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutStage statut;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @Column(columnDefinition = "TEXT")
    private String commentaires;

    @Column(name = "note_finale")
    private Double noteFinale;

    @Column(name = "rapport_stage")
    private String rapportStage;

    // Relation avec ProjetStage (Many-to-One)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_stage_id")
    private ProjetStage projetStage;

    // Constructeurs
    public Stage() {
        this.dateCreation = LocalDateTime.now();
        this.statut = StatutStage.EN_COURS;
    }

    public Stage(Candidature candidature, User stagiaire, OffreStage offreStage) {
        this();
        this.candidature = candidature;
        this.stagiaire = stagiaire;
        this.offreStage = offreStage;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Candidature getCandidature() {
        return candidature;
    }

    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }

    public User getStagiaire() {
        return stagiaire;
    }

    public void setStagiaire(User stagiaire) {
        this.stagiaire = stagiaire;
    }

    public OffreStage getOffreStage() {
        return offreStage;
    }

    public void setOffreStage(OffreStage offreStage) {
        this.offreStage = offreStage;
    }

    public StatutStage getStatut() {
        return statut;
    }

    public void setStatut(StatutStage statut) {
        this.statut = statut;
        this.dateModification = LocalDateTime.now();
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

    public String getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(String commentaires) {
        this.commentaires = commentaires;
    }

    public Double getNoteFinale() {
        return noteFinale;
    }

    public void setNoteFinale(Double noteFinale) {
        this.noteFinale = noteFinale;
    }

    public String getRapportStage() {
        return rapportStage;
    }

    public void setRapportStage(String rapportStage) {
        this.rapportStage = rapportStage;
    }

    public ProjetStage getProjetStage() {
        return projetStage;
    }

    public void setProjetStage(ProjetStage projetStage) {
        this.projetStage = projetStage;
    }

    @Override
    public String toString() {
        return "Stage{" +
                "id=" + id +
                ", stagiaire=" + (stagiaire != null ? stagiaire.getUsername() : null) +
                ", offreStage=" + (offreStage != null ? offreStage.getTitre() : null) +
                ", statut=" + statut +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                '}';
    }
}
