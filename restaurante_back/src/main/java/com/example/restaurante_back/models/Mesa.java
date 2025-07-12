package com.example.restaurante_back.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_mesa", nullable = false, unique = true, length = 20)
    private String numeroMesa;

    @Column(nullable = false)
    private int capacidad;

    @Column(length = 255)
    private String descripcion;

    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    @Column(nullable = false, length = 45)
    private String estado;
}