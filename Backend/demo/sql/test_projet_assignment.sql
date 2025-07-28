-- Script de test pour la fonctionnalité d'assignation de projet

-- 1. Vérifier la structure des tables
DESCRIBE projet_stage;
DESCRIBE stages;

-- 2. Vérifier les données existantes
SELECT COUNT(*) as total_projets FROM projet_stage;
SELECT COUNT(*) as total_stages FROM stages;
SELECT COUNT(*) as total_candidatures FROM candidatures;

-- 3. Afficher les stages avec leurs projets assignés
SELECT 
    s.id as stage_id,
    s.statut,
    s.date_debut,
    s.date_fin,
    u.first_name,
    u.last_name,
    o.titre as offre_titre,
    p.titre as projet_titre,
    p.description as projet_description
FROM stages s
LEFT JOIN users u ON s.stagiaire_id = u.id
LEFT JOIN offres_stage o ON s.offre_stage_id = o.id
LEFT JOIN projet_stage p ON s.projet_stage_id = p.id
ORDER BY s.date_creation DESC;

-- 4. Afficher les projets avec leurs détails complets
SELECT 
    id,
    titre,
    description,
    technologies_utilisees,
    objectifs,
    competences_requises,
    livrables_attendus,
    date_debut,
    date_fin
FROM projet_stage
ORDER BY id DESC;

-- 5. Vérifier les candidatures acceptées
SELECT 
    c.id,
    c.nom,
    c.prenom,
    c.email,
    c.statut,
    o.titre as offre_titre,
    s.id as stage_id
FROM candidatures c
LEFT JOIN offres_stage o ON c.offre_stage_id = o.id
LEFT JOIN stages s ON s.candidature_id = c.id
WHERE c.statut = 'ACCEPTEE'
ORDER BY c.date_candidature DESC;

-- 6. Statistiques
SELECT 
    'Total Projets' as metric,
    COUNT(*) as count
FROM projet_stage
UNION ALL
SELECT 
    'Projets avec dates',
    COUNT(*)
FROM projet_stage 
WHERE date_debut IS NOT NULL AND date_fin IS NOT NULL
UNION ALL
SELECT 
    'Stages avec projet assigné',
    COUNT(*)
FROM stages 
WHERE projet_stage_id IS NOT NULL
UNION ALL
SELECT 
    'Stages en cours',
    COUNT(*)
FROM stages 
WHERE statut = 'EN_COURS';
