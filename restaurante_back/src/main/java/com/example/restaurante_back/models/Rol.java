package com.example.restaurante_back.models;

import jakarta.persistence.*;
import lombok.Data;

@Data // Anotación de Lombok para generar getters, setters, etc.
@Entity // Indica a JPA que esta clase es una entidad y debe ser mapeada a una tabla.
@Table(name = "roles") // Especifica el nombre exacto de la tabla en la base de datos.
public class Rol {

    @Id // Marca este campo como la clave primaria (Primary Key).
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Le dice a MySQL que genere el valor de esta clave automáticamente (AUTO_INCREMENT).
    private Integer id;

    @Column(nullable = false, unique = true, length = 45) // Mapea a una columna, no puede ser nula y debe ser única.
    private String nombre;

    @Column(length = 255) // Campo opcional para descripción del rol
    private String descripcion;
}