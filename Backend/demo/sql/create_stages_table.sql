-- Script SQL pour créer la table des stages
-- À exécuter dans votre base de données MySQL

CREATE TABLE IF NOT EXISTS stages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidature_id BIGINT NOT NULL,
    stagiaire_id BIGINT NOT NULL,
    offre_stage_id BIGINT NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'EN_COURS',
    date_debut DATE,
    date_fin DATE,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME,
    commentaires TEXT,
    note_finale DECIMAL(4,2),
    rapport_stage VARCHAR(255),
    
    -- Contraintes de clés étrangères
    CONSTRAINT fk_stage_candidature FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE,
    CONSTRAINT fk_stage_stagiaire FOREIGN KEY (stagiaire_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_stage_offre FOREIGN KEY (offre_stage_id) REFERENCES offres_stage(id) ON DELETE CASCADE,
    
    -- Contrainte unique pour éviter les doublons
    CONSTRAINT uk_stage_candidature UNIQUE (candidature_id),
    
    -- Index pour améliorer les performances
    INDEX idx_stage_stagiaire (stagiaire_id),
    INDEX idx_stage_statut (statut),
    INDEX idx_stage_dates (date_debut, date_fin),
    INDEX idx_stage_creation (date_creation)
);

-- Commentaires sur la table
ALTER TABLE stages COMMENT = 'Table des stages créés à partir des candidatures acceptées';

-- Vérifier que les valeurs de statut sont valides
ALTER TABLE stages ADD CONSTRAINT chk_statut_stage 
CHECK (statut IN ('EN_COURS', 'TERMINE', 'ANNULE', 'SUSPENDU'));

-- Afficher la structure de la table créée
DESCRIBE stages;
