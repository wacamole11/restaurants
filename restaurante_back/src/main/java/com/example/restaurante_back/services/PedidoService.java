package com.example.restaurante_back.services;

import com.example.restaurante_back.models.Pedido;
import com.example.restaurante_back.dto.PedidoDTO;
import com.example.restaurante_back.dto.CreatePedidoDTO;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de pedidos.
 * Define las operaciones de negocio relacionadas con los pedidos.
 */
public interface PedidoService {
    List<Pedido> findAll();
    Optional<Pedido> findById(Integer id);
    Pedido save(Pedido pedido);
    void deleteById(Integer id);
    
    // Métodos DTO
    List<PedidoDTO> findAllDTO();
    Optional<PedidoDTO> findByIdDTO(Integer id);
    PedidoDTO convertToDTO(Pedido pedido);
    List<PedidoDTO> findByUsuarioIdDTO(Integer usuarioId);
    PedidoDTO createFromDTO(CreatePedidoDTO createPedidoDTO);
} 