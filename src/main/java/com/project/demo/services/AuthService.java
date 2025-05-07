package com.project.demo.services;

import com.project.demo.dtos.userDTOs.LoginRequest;
import com.project.demo.dtos.userDTOs.RegisterRequest;
import com.project.demo.entities.User;
import com.project.demo.repository.UserRepository;
import com.project.demo.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest request) {
        if (userRepo.findByUsername(request.getUsername()).isPresent())
            throw new RuntimeException("Username already exists");

        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepo.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password");

        return jwtUtil.generateToken(user.getUsername());
    }
}
