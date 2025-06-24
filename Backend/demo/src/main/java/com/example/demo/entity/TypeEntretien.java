package com.example.demo.entity;

public enum TypeEntretien {
    PRESENTIEL("Présentiel"),
    VISIOCONFERENCE("Visioconférence"),
    TELEPHONIQUE("Téléphonique");

    private final String libelle;

    TypeEntretien(String libelle) {
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
