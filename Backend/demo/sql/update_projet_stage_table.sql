-- Script pour ajouter les nouvelles colonnes à la table projet_stage
-- et ajouter la relation projet dans la table stages

-- Ajouter les nouvelles colonnes à projet_stage
ALTER TABLE projet_stage 
ADD COLUMN IF NOT EXISTS livrables_attendus TEXT,
ADD COLUMN IF NOT EXISTS date_debut DATE,
ADD COLUMN IF NOT EXISTS date_fin DATE;

-- Ajouter la colonne projet_stage_id à la table stages
ALTER TABLE stages 
ADD COLUMN IF NOT EXISTS projet_stage_id BIGINT,
ADD CONSTRAINT fk_stage_projet FOREIGN KEY (projet_stage_id) REFERENCES projet_stage(id) ON DELETE SET NULL;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_stages_projet_stage_id ON stages(projet_stage_id);

-- Commentaires pour documentation
ALTER TABLE projet_stage COMMENT = 'Table des projets de stage avec détails complets';
ALTER TABLE stages COMMENT = 'Table des stages avec relation vers les projets assignés';
