package com.example.restaurante_back.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String nombre;
    private String email;
    private String apellido;
    private String telefono;
    private boolean enabled = true;
} 