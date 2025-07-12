package com.example.restaurante_back.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO para transferir datos de reserva sin exponer las entidades JPA
 * Evita problemas de serialización con relaciones lazy
 */
@Data
public class ReservaDTO {
    private Integer id;
    private LocalDateTime fechaReserva;
    private int numPersonas;
    private String estado;
    private LocalDateTime fechaCreacion;
    private String canceladaPor; // USUARIO o ADMIN
    
    // Datos del usuario (solo información básica)
    private Integer usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    
    // Datos de la mesa (solo información básica)
    private Integer mesaId;
    private String mesaNombre;
    private int mesaCapacidad;
} 