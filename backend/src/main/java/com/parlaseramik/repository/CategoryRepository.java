package com.parlaseramik.repository;

import com.parlaseramik.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrue();
    Optional<Category> findByNameTr(String nameTr);
    Optional<Category> findByNameEn(String nameEn);
    boolean existsByNameTr(String nameTr);
    boolean existsByNameEn(String nameEn);
}
