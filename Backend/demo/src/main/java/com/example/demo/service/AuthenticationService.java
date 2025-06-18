package com.example.demo.service;

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
import java.util.List;
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

    public AuthenticationResponse register(User request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthenticationResponse(null, null, "Email already in use");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
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

    public AuthenticationResponse authenticate(User request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is not verified. Please check your email.");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllTokenByUser(user);
        saveUserToken(accessToken, refreshToken, user);

        return new AuthenticationResponse(accessToken, refreshToken, "User login was successful");
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
        User user = repository.findByEmail(email).orElseThrow(() -> new RuntimeException("No user found"));

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
}

