package com.parlaseramik.service;

import com.parlaseramik.dto.CreateProductRequest;
import com.parlaseramik.dto.ProductDTO;
import com.parlaseramik.entity.Category;
import com.parlaseramik.entity.Product;
import com.parlaseramik.exception.ResourceNotFoundException;
import com.parlaseramik.repository.CategoryRepository;
import com.parlaseramik.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::convertToDTO);
    }

    public Page<ProductDTO> getAllProductsIncludingInactive(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::convertToDTO);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::convertToDTO);
    }

    public Page<ProductDTO> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable).map(this::convertToDTO);
    }

    @Transactional
    @CacheEvict(value = {"products", "featuredProducts", "product"}, allEntries = true)
    public ProductDTO createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .nameTr(request.getNameTr())
                .nameEn(request.getNameEn())
                .descriptionTr(request.getDescriptionTr())
                .descriptionEn(request.getDescriptionEn())
                .price(request.getPrice())
                .stock(request.getStock())
                .images(request.getImages())
                .category(category)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .active(true)
                .averageRating(0.0)
                .reviewCount(0)
                .build();

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "featuredProducts", "product"}, allEntries = true)
    public ProductDTO updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setNameTr(request.getNameTr());
        product.setNameEn(request.getNameEn());
        product.setDescriptionTr(request.getDescriptionTr());
        product.setDescriptionEn(request.getDescriptionEn());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImages(request.getImages());
        product.setCategory(category);
        product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "featuredProducts", "product"}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = ProductDTO.builder()
                .id(product.getId())
                .nameTr(product.getNameTr())
                .nameEn(product.getNameEn())
                .descriptionTr(product.getDescriptionTr())
                .descriptionEn(product.getDescriptionEn())
                .price(product.getPrice())
                .stock(product.getStock())
                .images(product.getImages())
                .active(product.getActive())
                .featured(product.getFeatured())
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryNameTr(product.getCategory().getNameTr());
            dto.setCategoryNameEn(product.getCategory().getNameEn());
        }
        return dto;
    }
}
