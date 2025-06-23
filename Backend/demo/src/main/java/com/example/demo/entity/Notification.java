package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidature_id")
    private Candidature candidature;
    
    @Column(nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;
    
    @Column(nullable = false)
    private boolean lu = false;
    
    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();
    
    // Constructeurs
    public Notification() {}
    
    public Notification(User user, String titre, String message, TypeNotification type) {
        this.user = user;
        this.titre = titre;
        this.message = message;
        this.type = type;
    }
    
    public Notification(User user, Candidature candidature, String titre, String message, TypeNotification type) {
        this.user = user;
        this.candidature = candidature;
        this.titre = titre;
        this.message = message;
        this.type = type;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Candidature getCandidature() {
        return candidature;
    }
    
    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }
    
    public String getTitre() {
        return titre;
    }
    
    public void setTitre(String titre) {
        this.titre = titre;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public TypeNotification getType() {
        return type;
    }
    
    public void setType(TypeNotification type) {
        this.type = type;
    }
    
    public boolean isLu() {
        return lu;
    }
    
    public void setLu(boolean lu) {
        this.lu = lu;
    }
    
    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
    
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}
