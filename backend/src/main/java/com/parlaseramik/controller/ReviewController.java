package com.parlaseramik.controller;

import com.parlaseramik.dto.CreateReviewRequest;
import com.parlaseramik.dto.ReviewDTO;
import com.parlaseramik.entity.User;
import com.parlaseramik.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(request, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewDTO>> getMyReviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.getUserReviews(user.getId()));
    }
}
