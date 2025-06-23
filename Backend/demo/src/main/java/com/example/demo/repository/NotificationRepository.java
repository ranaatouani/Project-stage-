package com.example.demo.repository;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Récupérer toutes les notifications d'un utilisateur, triées par date (plus récentes en premier)
    List<Notification> findByUserOrderByDateCreationDesc(User user);
    
    // Récupérer les notifications non lues d'un utilisateur
    List<Notification> findByUserAndLuFalseOrderByDateCreationDesc(User user);
    
    // Compter les notifications non lues d'un utilisateur
    long countByUserAndLuFalse(User user);
    
    // Marquer toutes les notifications d'un utilisateur comme lues
    @Modifying
    @Query("UPDATE Notification n SET n.lu = true WHERE n.user = :user AND n.lu = false")
    void markAllAsReadByUser(@Param("user") User user);
}
