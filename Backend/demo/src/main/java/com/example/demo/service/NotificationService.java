package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled = false; // Force désactivation
    
    // Créer une notification pour un changement de statut de candidature
    public void creerNotificationChangementStatut(Candidature candidature, StatutCandidature ancienStatut) {
        if (candidature.getCandidat() == null) {
            logger.warn("Impossible de créer une notification : candidature sans utilisateur associé");
            return;
        }
        
        String titre;
        String message;
        TypeNotification type;
        
        switch (candidature.getStatut()) {
            case ACCEPTEE:
                titre = "Candidature acceptée !";
                message = String.format("Félicitations ! Votre candidature pour l'offre \"%s\" a été acceptée.", 
                                      candidature.getOffreStage().getTitre());
                type = TypeNotification.CANDIDATURE_ACCEPTEE;
                break;
                
            case REFUSEE:
                titre = "Candidature refusée";
                message = String.format("Votre candidature pour l'offre \"%s\" n'a pas été retenue cette fois-ci.", 
                                      candidature.getOffreStage().getTitre());
                type = TypeNotification.CANDIDATURE_REFUSEE;
                break;
                
            case EN_ATTENTE:
                titre = "Candidature en cours d'examen";
                message = String.format("Votre candidature pour l'offre \"%s\" est en cours d'examen.", 
                                      candidature.getOffreStage().getTitre());
                type = TypeNotification.CANDIDATURE_EN_ATTENTE;
                break;
                
            default:
                return; // Pas de notification pour les autres statuts
        }
        
        // Créer la notification
        Notification notification = new Notification(
            candidature.getCandidat(), 
            candidature, 
            titre, 
            message, 
            type
        );
        
        notificationRepository.save(notification);
        logger.info("Notification créée pour l'utilisateur {} : {}", 
                   candidature.getCandidat().getUsername(), titre);
        
        // Envoyer un email si le statut a changé vers ACCEPTEE ou REFUSEE
        if (emailEnabled && (candidature.getStatut() == StatutCandidature.ACCEPTEE ||
            candidature.getStatut() == StatutCandidature.REFUSEE)) {
            try {
                envoyerEmailNotification(candidature, titre, message);
                logger.info("Email de notification envoyé avec succès à {}", candidature.getEmail());
            } catch (Exception e) {
                logger.error("Erreur lors de l'envoi de l'email de notification: {}", e.getMessage());
                // Ne pas faire échouer l'opération si l'email ne peut pas être envoyé
                // La notification en base de données a été créée avec succès
            }
        } else if (!emailEnabled) {
            logger.info("Envoi d'email désactivé - notification créée en base uniquement");
        }
    }
    
    // Créer une notification pour une nouvelle candidature soumise
    public void creerNotificationNouvelleCandidature(Candidature candidature) {
        if (candidature.getCandidat() != null) {
            String titre = "Candidature soumise avec succès";
            String message = String.format("Votre candidature pour l'offre \"%s\" a été soumise avec succès. " +
                                         "Vous recevrez une notification dès qu'elle sera examinée.", 
                                         candidature.getOffreStage().getTitre());
            
            Notification notification = new Notification(
                candidature.getCandidat(), 
                candidature, 
                titre, 
                message, 
                TypeNotification.CANDIDATURE_SOUMISE
            );
            
            notificationRepository.save(notification);
            logger.info("Notification de soumission créée pour l'utilisateur {}", 
                       candidature.getCandidat().getUsername());
        }
    }
    
    // Récupérer les notifications d'un utilisateur
    public List<Notification> getNotificationsUtilisateur(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return notificationRepository.findByUserOrderByDateCreationDesc(user);
    }

    // Récupérer les notifications non lues d'un utilisateur
    public List<Notification> getNotificationsNonLues(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return notificationRepository.findByUserAndLuFalseOrderByDateCreationDesc(user);
    }

    // Compter les notifications non lues
    public long compterNotificationsNonLues(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return notificationRepository.countByUserAndLuFalse(user);
    }
    
    // Marquer une notification comme lue
    public void marquerCommeLue(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        if (!notification.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Accès non autorisé à cette notification");
        }
        
        notification.setLu(true);
        notificationRepository.save(notification);
    }
    
    // Marquer toutes les notifications comme lues
    @Transactional
    public void marquerToutesCommeLues(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        notificationRepository.markAllAsReadByUser(user);
    }
    
    // Envoyer un email de notification
    private void envoyerEmailNotification(Candidature candidature, String titre, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            
            helper.setTo(candidature.getEmail());
            helper.setFrom("atouanirana@gmail.com");
            helper.setSubject(titre);
            
            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">%s</h2>
                    <p>%s</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Détails de l'offre :</h3>
                        <p><strong>Titre :</strong> %s</p>
                        <p><strong>Entreprise :</strong> %s</p>
                        <p><strong>Lieu :</strong> %s</p>
                    </div>
                    <p>Cordialement,<br>L'équipe de gestion des stages</p>
                </div>
                """, 
                titre,
                message,
                candidature.getOffreStage().getTitre(),
                candidature.getOffreStage().getEntreprise(),
                candidature.getOffreStage().getLocalisation()
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            
            logger.info("Email de notification envoyé à {}", candidature.getEmail());
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email de notification : {}", e.getMessage());
        }
    }
}
