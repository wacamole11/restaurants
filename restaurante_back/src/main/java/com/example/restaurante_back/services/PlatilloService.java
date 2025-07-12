package com.example.restaurante_back.services;

import com.example.restaurante_back.models.Platillo;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface PlatilloService {
    List<Platillo> findAll();
    Optional<Platillo> findById(Integer id);
    Platillo save(Platillo platillo);
    void deleteById(Integer id);

    @Transactional(readOnly = true)
    List<Platillo> findByCategoria(String categoria);
}
