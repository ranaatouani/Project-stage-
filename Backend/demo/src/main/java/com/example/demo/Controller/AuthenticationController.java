package com.example.demo.Controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.AuthenticationResponse;
import com.example.demo.entity.User;
import com.example.demo.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        logger.info("Tentative d'inscription pour l'email: {}", request.getEmail());
        logger.info("Données reçues - Email: {}, FirstName: {}, LastName: {}, Password: {}, Role: {}",
                   request.getEmail(), request.getFirstName(), request.getLastName(),
                   request.getPassword() != null ? "[PRESENT]" : "[NULL]", request.getRole());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        logger.info("Tentative de connexion pour l'email: {}", request.getEmail());
        try {
            AuthenticationResponse response = authService.authenticate(request);
            logger.info("Connexion réussie pour l'email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la connexion pour l'email: {} - Erreur: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/refresh_token")
    public ResponseEntity refreshToken(HttpServletRequest request, HttpServletResponse response) {
        logger.info("Tentative de rafraîchissement du token");
        return authService.refreshToken(request, response);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        logger.info("Tentative de vérification du token: {}", token);
        boolean verified = authService.verifyToken(token);
        if (verified) {
            logger.info("Token vérifié avec succès");
            return ResponseEntity.ok("Compte vérifié avec succès. Vous pouvez maintenant vous connecter.");
        } else {
            logger.warn("Échec de la vérification du token");
            return ResponseEntity.badRequest().body("Le lien est invalide ou expiré.");
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        logger.info("Test de connexion reçu");
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend is reachable");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activate-account")
    public ResponseEntity<Map<String, String>> activateAccount(@RequestParam String email) {
        logger.info("Tentative d'activation manuelle pour l'email: {}", email);
        Map<String, String> response = new HashMap<>();
        try {
            boolean activated = authService.activateAccountByEmail(email);
            if (activated) {
                response.put("status", "success");
                response.put("message", "Compte activé avec succès");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de l'activation du compte: {}", e.getMessage());
            response.put("status", "error");
            response.put("message", "Erreur lors de l'activation: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/check-user")
    public ResponseEntity<Map<String, Object>> checkUser(@RequestParam String email) {
        logger.info("Vérification du statut de l'utilisateur: {}", email);
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> userInfo = authService.getUserInfo(email);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Erreur lors de la vérification de l'utilisateur: {} - Erreur: {}", email, e.getMessage());
            response.put("status", "error");
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getCurrentUserInfo(Authentication authentication) {
        logger.info("Récupération des informations de l'utilisateur connecté: {}", authentication.getName());
        try {
            Map<String, Object> userInfo = authService.getCurrentUserInfo(authentication.getName());
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des informations utilisateur: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> profileData, Authentication authentication) {
        logger.info("🔄 Mise à jour du profil pour l'utilisateur: {}", authentication.getName());
        logger.info("📝 Données reçues: {}", profileData);
        try {
            Map<String, Object> updatedUser = authService.updateUserProfile(authentication.getName(), profileData);
            logger.info("✅ Profil mis à jour avec succès pour: {}", authentication.getName());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Profil mis à jour avec succès");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Erreur lors de la mise à jour du profil pour {}: {}", authentication.getName(), e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}


