package com.parlaseramik.repository;

import com.parlaseramik.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(Long productId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Review> findByApprovedFalseOrderByCreatedAtDesc(Pageable pageable);
    Page<Review> findByProductIdAndApprovedTrue(Long productId, Pageable pageable);
    Page<Review> findByApprovedFalse(Pageable pageable);
}
