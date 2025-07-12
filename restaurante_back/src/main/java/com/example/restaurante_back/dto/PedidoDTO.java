package com.example.restaurante_back.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para transferir datos de pedido sin exponer las entidades JPA
 * Evita problemas de serialización con relaciones lazy
 */
@Data
public class PedidoDTO {
    private Integer id;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaCierre;
    private LocalDateTime horaEntregaProgramada;
    private Boolean canceladoPorReserva;
    
    // Datos básicos de la reserva
    private Integer reservaId;
    private LocalDateTime fechaReserva;
    private Integer numPersonas;
    private String estadoReserva;
    private String reservaMesaNombre; // Nombre de la mesa de la reserva
    
    // Datos básicos de la mesa
    private Integer mesaId;
    private String mesaNombre;
    private Integer mesaCapacidad;
    
    // Datos básicos del usuario
    private Integer usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    
    // Lista de detalles del pedido
    private List<PedidoPlatilloDTO> detalles;
} 