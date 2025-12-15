package com.parlaseramik.service;

import com.parlaseramik.dto.CreateOrderRequest;
import com.parlaseramik.dto.OrderDTO;
import com.parlaseramik.dto.OrderItemDTO;
import com.parlaseramik.entity.*;
import com.parlaseramik.exception.BadRequestException;
import com.parlaseramik.exception.ResourceNotFoundException;
import com.parlaseramik.repository.OrderRepository;
import com.parlaseramik.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::convertToDTO);
    }

    public List<OrderDTO> getUserOrders(Long userId, Order.OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        } else {
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        return convertToDTO(order);
    }

    public OrderDTO getUserOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request, User user) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("PS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setNotes(request.getNotes());

        // Create shipping address
        Address address = modelMapper.map(request.getShippingAddress(), Address.class);
        address.setUser(user);
        order.setShippingAddress(address);

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new BadRequestException("Yetersiz stok: " + product.getNameTr());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            orderItems.add(orderItem);

            totalAmount = totalAmount.add(orderItem.getSubtotal());

            // Update stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        order.setStatus(status);
        return convertToDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderDTO updatePaymentStatus(Long id, Order.PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));
        order.setPaymentStatus(paymentStatus);
        return convertToDTO(orderRepository.save(order));
    }

    @Transactional
    public OrderDTO cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sipariş bulunamadı"));

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new BadRequestException("Sadece bekleyen siparişler iptal edilebilir");
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return convertToDTO(orderRepository.save(order));
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUser().getId());
        dto.setUserEmail(order.getUser().getEmail());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getShippingAddress() != null) {
            dto.setShippingAddress(modelMapper.map(order.getShippingAddress(), com.parlaseramik.dto.AddressDTO.class));
        }

        List<OrderItemDTO> items = order.getOrderItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getNameTr());
            itemDTO.setProductImage(item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                    ? item.getProduct().getImages().get(0) : null);
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            itemDTO.setSubtotal(item.getSubtotal());
            return itemDTO;
        }).collect(Collectors.toList());
        dto.setOrderItems(items);

        return dto;
    }
}
