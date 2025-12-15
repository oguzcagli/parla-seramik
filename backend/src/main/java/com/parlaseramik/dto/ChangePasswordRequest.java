package com.parlaseramik.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;
    
    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalı")
    private String newPassword;
}
