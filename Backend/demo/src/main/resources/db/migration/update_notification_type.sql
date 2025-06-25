-- Mettre à jour la colonne type pour supporter ENTRETIEN_PROGRAMME
-- Option 1: Si la colonne est un ENUM (MySQL)
-- ALTER TABLE notifications MODIFY COLUMN type ENUM(
--     'CANDIDATURE_ACCEPTEE',
--     'CANDIDATURE_REFUSEE',
--     'CANDIDATURE_EN_ATTENTE',
--     'NOUVELLE_CANDIDATURE',
--     'CANDIDATURE_SOUMISE',
--     'ENTRETIEN_PROGRAMME'
-- ) NOT NULL;

-- Option 2: Changer vers VARCHAR pour plus de flexibilité (recommandé)
ALTER TABLE notifications MODIFY COLUMN type VARCHAR(50) NOT NULL;

-- Option 3: Si vous utilisez PostgreSQL
-- ALTER TABLE notifications ALTER COLUMN type TYPE VARCHAR(50);
