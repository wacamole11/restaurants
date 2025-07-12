package com.example.restaurante_back.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para crear nuevos pedidos
 * Contiene solo los campos necesarios para la creación
 */
@Data
public class CreatePedidoDTO {
    private Integer reservaId;
    private Integer mesaId;
    private Integer usuarioId;
    private BigDecimal total;
    private String estado;
    private LocalDateTime horaEntregaProgramada;
    private List<CreatePedidoPlatilloDTO> detalles;
    
    /**
     * DTO interno para los detalles del pedido
     */
    @Data
    public static class CreatePedidoPlatilloDTO {
        private Integer platilloId;
        private Integer cantidad;
        private BigDecimal precioUnitario;
    }
} 