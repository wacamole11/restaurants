package com.example.restaurante_back.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "platillos")
public class Platillo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT") // Usamos TEXT para descripciones potencialmente largas.
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2) // Para números decimales: 10 dígitos en total, 2 después de la coma.
    private BigDecimal precio;

    @Column(nullable = false, length = 50)
    private String categoria;

    private boolean disponible = true; // Por defecto, un nuevo platillo está disponible.
}