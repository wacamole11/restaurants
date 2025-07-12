package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Pedido.
 * Permite realizar operaciones CRUD sobre la tabla de pedidos.
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    // Buscar pedidos por usuario
    List<Pedido> findByUsuarioId(Integer usuarioId);
    // Buscar pedidos por reserva
    List<Pedido> findByReservaId(Integer reservaId);
} 