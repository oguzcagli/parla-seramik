package com.parlaseramik.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotEmpty(message = "Sipariş en az bir ürün içermeli")
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Teslimat adresi gerekli")
    @Valid
    private AddressDTO shippingAddress;
    
    private String notes;
    
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Ürün ID gerekli")
        private Long productId;
        
        @NotNull(message = "Miktar gerekli")
        private Integer quantity;
    }
}
