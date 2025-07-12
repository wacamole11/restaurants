package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.PedidoPlatillo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad PedidoPlatillo.
 * Permite realizar operaciones CRUD sobre la tabla de detalles de pedidos (pedidos_platillos).
 */
@Repository
public interface PedidoPlatilloRepository extends JpaRepository<PedidoPlatillo, Integer> {
    // Puedes agregar métodos personalizados aquí si lo necesitas
}