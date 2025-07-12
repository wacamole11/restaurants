package com.example.restaurante_back.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_reserva", nullable = false)
    private LocalDateTime fechaReserva;

    @Column(name = "num_personas", nullable = false)
    private int numPersonas;

    @Column(nullable = false, length = 45)
    private String estado;

    @Column(name = "fecha_creacion", updatable = false) // updatable=false para que no se modifique al actualizar.
    private LocalDateTime fechaCreacion;

    @Column(name = "cancelada_por", length = 20)
    private String canceladaPor; // USUARIO o ADMIN

    // --- RELACIONES ---

    // Relación Muchos a Uno con Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties("reservas") // Evita el bucle con la lista de reservas del usuario.
    private Usuario usuario;

    // Relación Muchos a Uno con Mesa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id", nullable = false)
    @JsonIgnoreProperties("reservas") // Evita bucles infinitos y problemas de serialización lazy
    private Mesa mesa;

    // Este método se ejecuta automáticamente antes de que una nueva reserva sea guardada.
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}