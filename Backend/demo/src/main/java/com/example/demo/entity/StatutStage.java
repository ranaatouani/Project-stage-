package com.example.demo.entity;

public enum StatutStage {
    EN_COURS("En cours"),
    TERMINE("Terminé"),
    ANNULE("Annulé"),
    SUSPENDU("Suspendu");

    private final String libelle;

    StatutStage(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }

    @Override
    public String toString() {
        return libelle;
    }
}
