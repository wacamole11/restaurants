package com.example.restaurante_back.services;

import com.example.restaurante_back.models.Mesa;
import java.util.List;
import java.util.Optional;

// Esta es la interfaz, el "contrato" que define QUÉ se puede hacer con las mesas.
public interface MesaService {
    List<Mesa> findAll();
    Optional<Mesa> findById(Integer id);
    Mesa save(Mesa mesa);
    void deleteById(Integer id);
}