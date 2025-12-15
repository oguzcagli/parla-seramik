package com.parlaseramik.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String nameTr;
    private String nameEn;
    private String descriptionTr;
    private String descriptionEn;
    private BigDecimal price;
    private Integer stock;
    private List<String> images;
    private Long categoryId;
    private String categoryNameTr;
    private String categoryNameEn;
    private Boolean active;
    private Boolean featured;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
