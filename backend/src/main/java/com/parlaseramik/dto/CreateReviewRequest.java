package com.parlaseramik.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewRequest {
    @NotNull(message = "Ürün ID gerekli")
    private Long productId;
    
    @NotNull(message = "Puan gerekli")
    @Min(value = 1, message = "Puan en az 1 olmalı")
    @Max(value = 5, message = "Puan en fazla 5 olmalı")
    private Integer rating;
    
    @NotBlank(message = "Yorum boş olamaz")
    @Size(min = 10, max = 1000, message = "Yorum 10-1000 karakter arasında olmalı")
    private String comment;
}
