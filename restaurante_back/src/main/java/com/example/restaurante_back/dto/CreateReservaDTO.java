package com.example.restaurante_back.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO para crear nuevas reservas
 * Solo recibe los datos necesarios para la creación
 */
@Data
public class CreateReservaDTO {
    private LocalDateTime fechaReserva;
    private int numPersonas;
    private Integer usuarioId;
    private Integer mesaId;
} 