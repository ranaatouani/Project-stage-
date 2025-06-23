package com.example.demo.mapper;

import com.example.demo.dto.OffreStageDTO;
import com.example.demo.dto.ProjetStageDTO;
import com.example.demo.entity.OffreStage;
import com.example.demo.entity.ProjetStage;
import org.springframework.stereotype.Component;

@Component
public class OffreStageMapper {

    public OffreStageDTO toDTO(OffreStage offreStage) {
        if (offreStage == null) {
            return null;
        }

        OffreStageDTO dto = new OffreStageDTO();
        dto.setId(offreStage.getId());
        dto.setTitre(offreStage.getTitre());
        dto.setDescription(offreStage.getDescription());
        dto.setLocalisation(offreStage.getLocalisation());
        dto.setDureeSemaines(offreStage.getDureeSemaines());
        dto.setEntreprise(offreStage.getEntreprise());
        dto.setContactEmail(offreStage.getContactEmail());
        dto.setSalaireMensuel(offreStage.getSalaireMensuel());
        dto.setPublie(offreStage.isEstPublie());
        dto.setDateCreation(offreStage.getDateCreation());
        dto.setDatePublication(offreStage.getDatePublication());
        
        // Mapper le projet associé
        if (offreStage.getProjetStage() != null) {
            dto.setProjetStage(toProjetStageDTO(offreStage.getProjetStage()));
        }
        
        // Mapper l'email du créateur
        if (offreStage.getCreatedBy() != null) {
            dto.setCreatedByEmail(offreStage.getCreatedBy().getEmail());
        }

        return dto;
    }

    public ProjetStageDTO toProjetStageDTO(ProjetStage projetStage) {
        if (projetStage == null) {
            return null;
        }

        ProjetStageDTO dto = new ProjetStageDTO();
        dto.setId(projetStage.getId());
        dto.setTitre(projetStage.getTitre());
        dto.setDescription(projetStage.getDescription());
        dto.setTechnologiesUtilisees(projetStage.getTechnologiesUtilisees());
        dto.setObjectifs(projetStage.getObjectifs());
        dto.setCompetencesRequises(projetStage.getCompetencesRequises());

        return dto;
    }

    public OffreStage toEntity(OffreStageDTO dto) {
        if (dto == null) {
            return null;
        }

        OffreStage offreStage = new OffreStage();
        offreStage.setId(dto.getId());
        offreStage.setTitre(dto.getTitre());
        offreStage.setDescription(dto.getDescription());
        offreStage.setLocalisation(dto.getLocalisation());
        offreStage.setDureeSemaines(dto.getDureeSemaines());
        offreStage.setEntreprise(dto.getEntreprise());
        offreStage.setContactEmail(dto.getContactEmail());
        offreStage.setSalaireMensuel(dto.getSalaireMensuel());
        offreStage.setEstPublie(dto.isPublie());
        offreStage.setDateCreation(dto.getDateCreation());
        offreStage.setDatePublication(dto.getDatePublication());

        // Mapper le projet associé
        if (dto.getProjetStage() != null) {
            offreStage.setProjetStage(toProjetStageEntity(dto.getProjetStage()));
        }

        return offreStage;
    }

    public ProjetStage toProjetStageEntity(ProjetStageDTO dto) {
        if (dto == null) {
            return null;
        }

        ProjetStage projetStage = new ProjetStage();
        projetStage.setId(dto.getId());
        projetStage.setTitre(dto.getTitre());
        projetStage.setDescription(dto.getDescription());
        projetStage.setTechnologiesUtilisees(dto.getTechnologiesUtilisees());
        projetStage.setObjectifs(dto.getObjectifs());
        projetStage.setCompetencesRequises(dto.getCompetencesRequises());

        return projetStage;
    }
}
