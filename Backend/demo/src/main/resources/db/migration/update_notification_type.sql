-- Mettre à jour l'enum TypeNotification pour inclure ENTRETIEN_PROGRAMME
-- Si vous utilisez MySQL
ALTER TABLE notifications MODIFY COLUMN type ENUM(
    'CANDIDATURE_ACCEPTEE',
    'CANDIDATURE_REFUSEE', 
    'CANDIDATURE_EN_ATTENTE',
    'NOUVELLE_CANDIDATURE',
    'CANDIDATURE_SOUMISE',
    'ENTRETIEN_PROGRAMME'
) NOT NULL;

-- Alternative pour augmenter la taille de la colonne si c'est un VARCHAR
-- ALTER TABLE notifications MODIFY COLUMN type VARCHAR(50) NOT NULL;
