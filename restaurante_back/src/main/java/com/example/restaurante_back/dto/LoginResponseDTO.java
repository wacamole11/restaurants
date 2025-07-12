package com.example.restaurante_back.dto;

import lombok.Data;
import java.util.Set;

@Data
public class LoginResponseDTO {
    private Integer id;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private boolean enabled;
    private Set<String> roles; // Solo los nombres de los roles, no los objetos completos
} 