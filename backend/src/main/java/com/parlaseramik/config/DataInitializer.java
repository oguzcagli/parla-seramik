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
        if (userRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        log.info("Initializing sample data...");
        
        // Create Admin User
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@parlaseramik.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);
        
        // Create Test User
        User user = User.builder()
                .firstName("Test")
                .lastName("User")
                .email("test@parlaseramik.com")
                .password(passwordEncoder.encode("test123"))
                .role(User.Role.USER)
                .enabled(true)
                .build();
        userRepository.save(user);
        
        // Create Categories
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
        
        log.info("Sample data initialized successfully!");
        log.info("Admin login: admin@parlaseramik.com / admin123");
        log.info("User login: test@parlaseramik.com / test123");
    }
}
