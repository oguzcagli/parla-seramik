package com.parlaseramik.service;

import com.parlaseramik.dto.AuthRequest;
import com.parlaseramik.dto.AuthResponse;
import com.parlaseramik.dto.RegisterRequest;
import com.parlaseramik.dto.UserDTO;
import com.parlaseramik.entity.User;
import com.parlaseramik.exception.BadRequestException;
import com.parlaseramik.repository.UserRepository;
import com.parlaseramik.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.USER)
                .enabled(true)
                .build();
        
        userRepository.save(user);
        
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .user(modelMapper.map(user, UserDTO.class))
                .build();
    }
    
    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadRequestException("E-posta veya şifre hatalı");
        }
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("E-posta veya şifre hatalı"));
        
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .user(modelMapper.map(user, UserDTO.class))
                .build();
    }
}
