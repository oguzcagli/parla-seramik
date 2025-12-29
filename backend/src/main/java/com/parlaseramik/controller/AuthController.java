package com.parlaseramik.controller;

import com.parlaseramik.dto.AuthRequest;
import com.parlaseramik.dto.AuthResponse;
import com.parlaseramik.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    // Kayıt devre dışı - sadece admin girişi aktif
    // @PostMapping("/register")
    // public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    //     return ResponseEntity.ok(authService.register(request));
    // }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
