package com.example.restaurante_back.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO para transferir datos de detalle de pedido sin exponer las entidades JPA
 */
@Data
public class PedidoPlatilloDTO {
    private Integer id;
    private Integer platilloId;
    private String platilloNombre;
    private String platilloCategoria;
    private BigDecimal precioUnitario;
    private int cantidad;
} 