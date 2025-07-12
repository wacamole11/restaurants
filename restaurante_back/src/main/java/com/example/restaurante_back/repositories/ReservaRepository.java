package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    /**
     * Busca todas las reservas de un usuario específico.
     * Útil para mostrar el historial de reservas de un cliente.
     * @param usuarioId El ID del usuario.
     * @return Una lista de reservas hechas por ese usuario.
     */
    List<Reserva> findByUsuarioId(Integer usuarioId);

    /**
     * Busca todas las reservas para una mesa específica.
     * @param mesaId El ID de la mesa.
     * @return Una lista de reservas para esa mesa.
     */
    List<Reserva> findByMesaId(Integer mesaId);

    /**
     * Busca reservas dentro de un rango de fechas.
     * Muy útil para los reportes del administrador.
     * @param fechaInicio La fecha y hora de inicio del rango.
     * @param fechaFin La fecha y hora de fin del rango.
     * @return Una lista de reservas que caen dentro de ese período.
     */
    List<Reserva> findByFechaReservaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}