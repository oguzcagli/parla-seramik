package com.parlaseramik.controller;

import com.parlaseramik.dto.CreateOrderRequest;
import com.parlaseramik.dto.OrderDTO;
import com.parlaseramik.entity.Order;
import com.parlaseramik.entity.User;
import com.parlaseramik.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Order.OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getId(), status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(orderService.getUserOrderById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(request, user));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(orderService.cancelOrder(id, user.getId()));
    }
}
