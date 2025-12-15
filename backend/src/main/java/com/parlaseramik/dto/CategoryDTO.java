package com.parlaseramik.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String nameTr;
    private String nameEn;
    private String descriptionTr;
    private String descriptionEn;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
