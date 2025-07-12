package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.models.PedidoPlatillo;
import com.example.restaurante_back.repositories.PedidoPlatilloRepository;
import com.example.restaurante_back.services.PedidoPlatilloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementación de PedidoPlatilloService para la gestión de detalles de pedidos.
 */
@Service
public class PedidoPlatilloServiceImpl implements PedidoPlatilloService {
    @Autowired
    private PedidoPlatilloRepository pedidoPlatilloRepository;

    @Override
    public List<PedidoPlatillo> findAll() {
        return pedidoPlatilloRepository.findAll();
    }

    @Override
    public Optional<PedidoPlatillo> findById(Integer id) {
        return pedidoPlatilloRepository.findById(id);
    }

    @Override
    public PedidoPlatillo save(PedidoPlatillo detalle) {
        return pedidoPlatilloRepository.save(detalle);
    }

    @Override
    public void deleteById(Integer id) {
        pedidoPlatilloRepository.deleteById(id);
    }
} 