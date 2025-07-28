package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    return new RuntimeException("Utilisateur non trouvé: " + username);
                });
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    return new RuntimeException("Utilisateur non trouvé: " + email);
                });
    }
    
    public Optional<User> findByUsernameOptional(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    return new RuntimeException("Utilisateur non trouvé avec l'ID: " + id);
                });
    }
}
