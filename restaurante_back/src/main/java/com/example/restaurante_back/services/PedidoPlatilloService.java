package com.example.restaurante_back.services;

import com.example.restaurante_back.models.PedidoPlatillo;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de los detalles de pedidos (platillos en cada pedido).
 * Define las operaciones de negocio relacionadas con los detalles de pedidos.
 */
public interface PedidoPlatilloService {
    List<PedidoPlatillo> findAll();
    Optional<PedidoPlatillo> findById(Integer id);
    PedidoPlatillo save(PedidoPlatillo detalle);
    void deleteById(Integer id);
} 