package com.parlaseramik.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminReplyRequest {
    @NotBlank(message = "Cevap boş olamaz")
    @Size(max = 1000, message = "Cevap en fazla 1000 karakter olabilir")
    private String adminReply;
}
