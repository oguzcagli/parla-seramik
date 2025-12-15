package com.parlaseramik.service;

import com.parlaseramik.dto.CategoryDTO;
import com.parlaseramik.entity.Category;
import com.parlaseramik.exception.ResourceNotFoundException;
import com.parlaseramik.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories")
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getAllCategoriesIncludingInactive() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "category", key = "#id")
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToDTO(category);
    }

    @Transactional
    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Check if category with same name already exists
        if (categoryRepository.existsByNameTr(categoryDTO.getNameTr())) {
            throw new IllegalArgumentException("Bu isimde (TR) bir kategori zaten mevcut: " + categoryDTO.getNameTr());
        }
        if (categoryRepository.existsByNameEn(categoryDTO.getNameEn())) {
            throw new IllegalArgumentException("Bu isimde (EN) bir kategori zaten mevcut: " + categoryDTO.getNameEn());
        }
        
        Category category = Category.builder()
                .nameTr(categoryDTO.getNameTr())
                .nameEn(categoryDTO.getNameEn())
                .descriptionTr(categoryDTO.getDescriptionTr())
                .descriptionEn(categoryDTO.getDescriptionEn())
                .active(true)
                .build();
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    @Transactional
    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setNameTr(categoryDTO.getNameTr());
        category.setNameEn(categoryDTO.getNameEn());
        category.setDescriptionTr(categoryDTO.getDescriptionTr());
        category.setDescriptionEn(categoryDTO.getDescriptionEn());

        Category updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    @Transactional
    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setActive(false);
        categoryRepository.save(category);
    }

    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .nameTr(category.getNameTr())
                .nameEn(category.getNameEn())
                .descriptionTr(category.getDescriptionTr())
                .descriptionEn(category.getDescriptionEn())
                .active(category.getActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
