package com.parlaseramik.config;

import com.parlaseramik.entity.Category;
import com.parlaseramik.entity.Product;
import com.parlaseramik.entity.User;
import com.parlaseramik.repository.CategoryRepository;
import com.parlaseramik.repository.ProductRepository;
import com.parlaseramik.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Admin kullanıcısını kontrol et ve güncelle
        ensureAdminExists();
        
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
    }
    
    private void ensureAdminExists() {
        String adminEmail = "oguzcagli@hotmail.com";
        String adminPassword = "mN98!pSHa-*";
        
        // Eski admin'i sil (varsa)
        userRepository.findByEmail("admin@parlaseramik.com").ifPresent(user -> {
            log.info("Removing old admin user...");
            userRepository.delete(user);
        });
        
        // Test kullanıcısını sil (varsa)
        userRepository.findByEmail("test@parlaseramik.com").ifPresent(user -> {
            log.info("Removing test user...");
            userRepository.delete(user);
        });
        
        // Admin varsa şifresini güncelle, yoksa oluştur
        var existingAdmin = userRepository.findByEmail(adminEmail);
        if (existingAdmin.isPresent()) {
            User admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Admin user password updated: {}", adminEmail);
        } else {
            log.info("Creating admin user...");
            User admin = User.builder()
                    .firstName("Oğuz")
                    .lastName("Çağlı")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: {}", adminEmail);
        }
    }
    
    private void initializeCategories() {
        log.info("Initializing categories...");
        Category kupalar = Category.builder()
                .nameTr("Kupalar")
                .nameEn("Mugs")
                .descriptionTr("El yapımı seramik kupalar")
                .descriptionEn("Handmade ceramic mugs")
                .active(true)
                .build();
        categoryRepository.save(kupalar);

        Category tabaklar = Category.builder()
                .nameTr("Tabaklar")
                .nameEn("Plates")
                .descriptionTr("Dekoratif ve kullanışlı seramik tabaklar")
                .descriptionEn("Decorative and functional ceramic plates")
                .active(true)
                .build();
        categoryRepository.save(tabaklar);

        Category vazolar = Category.builder()
                .nameTr("Vazolar")
                .nameEn("Vases")
                .descriptionTr("Şık seramik vazolar")
                .descriptionEn("Elegant ceramic vases")
                .active(true)
                .build();
        categoryRepository.save(vazolar);

        // Create Products
        Product product1 = Product.builder()
                .nameTr("El Yapımı Seramik Kupa - Mavi")
                .nameEn("Handmade Ceramic Mug - Blue")
                .descriptionTr("Özenle hazırlanmış, benzersiz mavi tonlarında el yapımı seramik kupa.")
                .descriptionEn("Carefully crafted, unique handmade ceramic mug in blue tones.")
                .price(new BigDecimal("250.00"))
                .stock(50)
                .images(List.of("https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"))
                .category(kupalar)
                .active(true)
                .featured(true)
                .averageRating(0.0)
                .reviewCount(0)
                .build();
        productRepository.save(product1);

        Product product2 = Product.builder()
                .nameTr("Dekoratif Seramik Tabak")
                .nameEn("Decorative Ceramic Plate")
                .descriptionTr("Duvar süsü olarak kullanılabilecek dekoratif seramik tabak.")
                .descriptionEn("Decorative ceramic plate that can be used as wall decoration.")
                .price(new BigDecimal("350.00"))
                .stock(30)
                .images(List.of("https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500"))
                .category(tabaklar)
                .active(true)
                .featured(true)
                .averageRating(0.0)
                .reviewCount(0)
                .build();
        productRepository.save(product2);

        Product product3 = Product.builder()
                .nameTr("Modern Seramik Vazo")
                .nameEn("Modern Ceramic Vase")
                .descriptionTr("Minimalist tasarımlı modern seramik vazo.")
                .descriptionEn("Modern ceramic vase with minimalist design.")
                .price(new BigDecimal("450.00"))
                .stock(20)
                .images(List.of("https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500"))
                .category(vazolar)
                .active(true)
                .featured(true)
                .averageRating(0.0)
                .reviewCount(0)
                .build();
        productRepository.save(product3);

        log.info("Categories initialized successfully!");
    }
}
