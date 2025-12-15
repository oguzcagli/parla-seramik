package com.parlaseramik.service;

import com.parlaseramik.dto.AdminReplyRequest;
import com.parlaseramik.dto.CreateReviewRequest;
import com.parlaseramik.dto.ReviewDTO;
import com.parlaseramik.entity.Product;
import com.parlaseramik.entity.Review;
import com.parlaseramik.entity.User;
import com.parlaseramik.exception.ResourceNotFoundException;
import com.parlaseramik.repository.ProductRepository;
import com.parlaseramik.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public List<ReviewDTO> getApprovedReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getUserReviews(Long userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Page<ReviewDTO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::convertToDTO);
    }

    public Page<ReviewDTO> getPendingReviews(Pageable pageable) {
        return reviewRepository.findByApprovedFalseOrderByCreatedAtDesc(pageable).map(this::convertToDTO);
    }

    @Transactional
    public ReviewDTO createReview(CreateReviewRequest request, User user) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .approved(false)
                .build();

        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    @Transactional
    public ReviewDTO approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı"));
        review.setApproved(true);
        Review savedReview = reviewRepository.save(review);

        // Update product average rating
        updateProductRating(review.getProduct().getId());

        return convertToDTO(savedReview);
    }

    @Transactional
    public ReviewDTO replyToReview(Long id, AdminReplyRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı"));
        review.setAdminReply(request.getAdminReply());
        return convertToDTO(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yorum bulunamadı"));
        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı"));

        List<Review> approvedReviews = reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId);
        if (approvedReviews.isEmpty()) {
            product.setAverageRating(0.0);
            product.setReviewCount(0);
        } else {
            double avgRating = approvedReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            product.setAverageRating(avgRating);
            product.setReviewCount(approvedReviews.size());
        }
        productRepository.save(product);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getId());
        dto.setProductName(review.getProduct().getNameTr());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setAdminReply(review.getAdminReply());
        dto.setApproved(review.getApproved());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }
}
