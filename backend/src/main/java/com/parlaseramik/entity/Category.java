package com.parlaseramik.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String nameTr;

    @Column(nullable = false, unique = true)
    private String nameEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionTr;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
