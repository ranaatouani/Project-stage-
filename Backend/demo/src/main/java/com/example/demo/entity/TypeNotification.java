package com.example.demo.entity;

public enum TypeNotification {
    CANDIDATURE_ACCEPTEE("Candidature acceptée", "success"),
    CANDIDATURE_REFUSEE("Candidature refusée", "error"),
    CANDIDATURE_EN_ATTENTE("Candidature en attente", "info"),
    NOUVELLE_CANDIDATURE("Nouvelle candidature", "info"),
    CANDIDATURE_SOUMISE("Candidature soumise", "success"),
    ENTRETIEN_PROGRAMME("Entretien programmé", "info");
    
    private final String libelle;
    private final String couleur;
    
    TypeNotification(String libelle, String couleur) {
        this.libelle = libelle;
        this.couleur = couleur;
    }
    
    public String getLibelle() {
        return libelle;
    }
    
    public String getCouleur() {
        return couleur;
    }
}
