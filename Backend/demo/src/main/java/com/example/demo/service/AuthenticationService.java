package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.AuthenticationResponse;
import com.example.demo.entity.Token;
import com.example.demo.entity.User;
import com.example.demo.entity.VerificationToken;
import com.example.demo.repository.TokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;
    private final VerificationTokenRepository verificationTokenRepository;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 TokenRepository tokenRepository,
                                 AuthenticationManager authenticationManager,
                                 JavaMailSender mailSender,
                                 VerificationTokenRepository verificationTokenRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
        this.mailSender = mailSender;
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // Logs de débogage
        System.out.println("=== REGISTER DEBUG ===");
        System.out.println("Email reçu: " + request.getEmail());
        System.out.println("Prénom reçu: " + request.getFirstName());
        System.out.println("Nom reçu: " + request.getLastName());
        System.out.println("Mot de passe reçu: " + request.getPassword());
        System.out.println("Rôle reçu: " + request.getRole());
        System.out.println("======================");

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthenticationResponse(null, null, "Email already in use");
        }

        // Vérification que le mot de passe n'est pas null
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Le mot de passe ne peut pas être vide");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEmail(request.getEmail());
        user.setEnabled(false);

        user = repository.save(user);

        String verificationToken = UUID.randomUUID().toString();
        VerificationToken vToken = new VerificationToken();
        vToken.setToken(verificationToken);
        vToken.setUser(user);
        vToken.setExpiryDate(Timestamp.valueOf(LocalDateTime.now().plusHours(24)));
        verificationTokenRepository.save(vToken);

        sendVerificationEmail(user.getEmail(), verificationToken);

        return new AuthenticationResponse(null, null, "User registered successfully. Please check your email to verify your account.");
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        try {
            // Vérifier d'abord si l'utilisateur existe
            User user = repository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        return new RuntimeException("User not found");
                    });

            System.out.println("Utilisateur trouvé: " + user.getEmail());
            System.out.println("Compte activé: " + user.isEnabled());
            System.out.println("Mot de passe hashé en DB: " + user.getPassword());
            System.out.println("Mot de passe fourni: " + request.getPassword());

            // Vérifier si le compte est activé avant l'authentification
            if (!user.isEnabled()) {
                throw new RuntimeException("Account is not verified. Please check your email.");
            }

            // Tenter l'authentification
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken, refreshToken, user);

            return new AuthenticationResponse(accessToken, refreshToken, "User login was successful");
        } catch (Exception e) {
            System.out.println("Erreur d'authentification: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Les identifications sont erronées");
        }
    }

    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getId());
        if (validTokens.isEmpty()) {
            return;
        }
        validTokens.forEach(t -> t.setLoggedOut(true));
        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String accessToken, String refreshToken, User user) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    public ResponseEntity refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        User user = repository.findByEmail(email).orElseThrow(() -> {
            return new RuntimeException("No user found");
        });

        if (jwtService.isValidRefreshToken(token, user)) {
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken, refreshToken, user);

            return new ResponseEntity(new AuthenticationResponse(accessToken, refreshToken, "New token generated"), HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }

    private void sendVerificationEmail(String email, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setFrom("atouanirana@gmail.com");
            helper.setSubject("Verify Your Email");
            String verificationLink = "http://localhost:5173/authentication/verify-email?token=" + verificationToken;
            String content = "<p>Please click the link below to verify your email:</p>" +
                    "<a href=\"" + verificationLink + "\">Verify Email</a>";
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public boolean verifyToken(String token) {
        VerificationToken vToken = verificationTokenRepository.findByToken(token);
        if (vToken == null || vToken.getExpiryDate().before(Timestamp.valueOf(LocalDateTime.now()))) {
            return false;
        }
        User user = vToken.getUser();
        user.setEnabled(true);
        repository.save(user);
        verificationTokenRepository.delete(vToken);
        return true;
    }

    public boolean activateAccountByEmail(String email) {
        User user = repository.findByEmail(email).orElse(null);
        if (user != null) {
            user.setEnabled(true);
            repository.save(user);
            return true;
        }
        return false;
    }

    public Map<String, Object> getUserInfo(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> {
                    return new RuntimeException("Utilisateur non trouvé");
                });

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", user.getEmail());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("role", user.getRole());
        userInfo.put("enabled", user.isEnabled());
        userInfo.put("accountNonExpired", user.isAccountNonExpired());
        userInfo.put("accountNonLocked", user.isAccountNonLocked());
        userInfo.put("credentialsNonExpired", user.isCredentialsNonExpired());

        return userInfo;
    }

    public Map<String, Object> getCurrentUserInfo(String email) {
        User user = repository.findByEmail(email).orElseThrow(() -> {
            return new RuntimeException("Utilisateur non trouvé");
        });
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("email", user.getEmail());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("username", user.getRawUsername());
        userInfo.put("role", user.getRole().toString());
        userInfo.put("enabled", user.isEnabled());
        return userInfo;
    }

    public Map<String, Object> updateUserProfile(String email, Map<String, String> profileData) {
        User user = repository.findByEmail(email).orElseThrow(() -> {
            return new RuntimeException("Utilisateur non trouvé");
        });

        // Mise à jour des champs si fournis
        if (profileData.containsKey("firstName") && profileData.get("firstName") != null) {
            user.setFirstName(profileData.get("firstName"));
        }
        if (profileData.containsKey("lastName") && profileData.get("lastName") != null) {
            user.setLastName(profileData.get("lastName"));
        }
        if (profileData.containsKey("username") && profileData.get("username") != null) {
            user.setUsername(profileData.get("username"));
        }
        if (profileData.containsKey("email") && profileData.get("email") != null) {
            // Vérifier que le nouvel email n'est pas déjà utilisé
            String newEmail = profileData.get("email");
            if (!newEmail.equals(user.getEmail()) && repository.findByEmail(newEmail).isPresent()) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre compte");
            }
            user.setEmail(newEmail);
        }

        // Sauvegarder les modifications
        user = repository.save(user);

        // Retourner les informations mises à jour
        return getCurrentUserInfo(user.getEmail());
    }
}

