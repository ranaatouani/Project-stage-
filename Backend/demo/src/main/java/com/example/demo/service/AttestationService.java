package com.example.demo.service;

import com.example.demo.entity.Stage;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class AttestationService {

    private static final Logger logger = LoggerFactory.getLogger(AttestationService.class);

    /**
     * Génère une attestation de stage au format PDF
     */
    public byte[] genererAttestationStage(Stage stage) {
        logger.info("Génération de l'attestation de stage pour le stage ID: {}", stage.getId());
        
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Configuration des polices
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont normalFont = PdfFontFactory.createFont();

            // En-tête
            Paragraph header = new Paragraph()
                .add(new Text("ATTESTATION DE STAGE").setFont(titleFont).setFontSize(20).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30);
            document.add(header);

            // Informations de l'entreprise/organisation
            Paragraph entrepriseInfo = new Paragraph()
                .add(new Text("StageConnect - Plateforme de Gestion des Stages").setFont(titleFont).setFontSize(14).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
            document.add(entrepriseInfo);

            // Corps de l'attestation
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
            String dateDebut = stage.getDateDebut() != null ? stage.getDateDebut().format(formatter) : "Non définie";
            String dateFin = stage.getDateFin() != null ? stage.getDateFin().format(formatter) : "Non définie";

            Paragraph corps = new Paragraph()
                .add(new Text("Je soussigné(e), ").setFont(normalFont).setFontSize(12))
                .add(new Text("Directeur de StageConnect").setFont(normalFont).setFontSize(12).setBold())
                .add(new Text(", atteste par la présente que :\n\n").setFont(normalFont).setFontSize(12))
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
            document.add(corps);

            // Informations du stagiaire
            Paragraph stagiaireInfo = new Paragraph()
                .add(new Text("Monsieur/Madame ").setFont(normalFont).setFontSize(12))
                .add(new Text(stage.getStagiaire().getFirstName() + " " + stage.getStagiaire().getLastName())
                    .setFont(normalFont).setFontSize(12).setBold().setFontColor(ColorConstants.BLUE))
                .add(new Text("\n\na effectué un stage au sein de notre organisation dans le cadre de :\n\n")
                    .setFont(normalFont).setFontSize(12))
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(15);
            document.add(stagiaireInfo);

            // Détails du stage
            Paragraph detailsStage = new Paragraph()
                .add(new Text("• Intitulé du stage : ").setFont(normalFont).setFontSize(12))
                .add(new Text(stage.getOffreStage().getTitre()).setFont(normalFont).setFontSize(12).setBold())
                .add(new Text("\n• Entreprise d'accueil : ").setFont(normalFont).setFontSize(12))
                .add(new Text(stage.getOffreStage().getEntreprise()).setFont(normalFont).setFontSize(12).setBold())
                .add(new Text("\n• Période du stage : du ").setFont(normalFont).setFontSize(12))
                .add(new Text(dateDebut).setFont(normalFont).setFontSize(12).setBold())
                .add(new Text(" au ").setFont(normalFont).setFontSize(12))
                .add(new Text(dateFin).setFont(normalFont).setFontSize(12).setBold())
                .setMarginBottom(20);
            document.add(detailsStage);

            // Projet assigné (si disponible)
            if (stage.getProjetStage() != null) {
                Paragraph projetInfo = new Paragraph()
                    .add(new Text("• Projet réalisé : ").setFont(normalFont).setFontSize(12))
                    .add(new Text(stage.getProjetStage().getTitre()).setFont(normalFont).setFontSize(12).setBold())
                    .setMarginBottom(20);
                document.add(projetInfo);
            }

            // Conclusion
            Paragraph conclusion = new Paragraph()
                .add(new Text("Durant cette période, le/la stagiaire a fait preuve de sérieux, de motivation et a mené à bien les missions qui lui ont été confiées.\n\n")
                    .setFont(normalFont).setFontSize(12))
                .add(new Text("Cette attestation est délivrée pour servir et valoir ce que de droit.\n\n")
                    .setFont(normalFont).setFontSize(12))
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(30);
            document.add(conclusion);

            // Date et signature
            String dateAttestation = java.time.LocalDate.now().format(formatter);
            Paragraph signature = new Paragraph()
                .add(new Text("Fait le " + dateAttestation + "\n\n").setFont(normalFont).setFontSize(12))
                .add(new Text("Le Directeur\n").setFont(normalFont).setFontSize(12).setBold())
                .add(new Text("StageConnect").setFont(normalFont).setFontSize(12))
                .setTextAlignment(TextAlignment.RIGHT);
            document.add(signature);

            // Pied de page
            Paragraph footer = new Paragraph()
                .add(new Text("StageConnect - Plateforme de Gestion des Stages")
                    .setFont(normalFont).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .setTextAlignment(TextAlignment.CENTER)
                .setFixedPosition(50, 30, 500);
            document.add(footer);

            document.close();
            
            logger.info("Attestation générée avec succès pour le stage ID: {}", stage.getId());
            return baos.toByteArray();
            
        } catch (Exception e) {
            logger.error("Erreur lors de la génération de l'attestation pour le stage ID: {}", stage.getId(), e);
            throw new RuntimeException("Erreur lors de la génération de l'attestation: " + e.getMessage());
        }
    }
}
