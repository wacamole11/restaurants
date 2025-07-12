package com.example.restaurante_back.dto;

import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

/**
 * DTO para transferir datos de usuario sin exponer las entidades JPA
 * Evita problemas de serialización con relaciones lazy
 */
@Data
public class UsuarioDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String username;
    private String email;
    private String telefono;
    private boolean enabled;
    
    // Solo los nombres de los roles, no las entidades completas
    private List<String> roles;

    // Auditoría
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private LocalDateTime ultimoLogin;
} 