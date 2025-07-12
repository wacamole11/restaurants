package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.models.Platillo;
import com.example.restaurante_back.repositories.PlatilloRepository;
import com.example.restaurante_back.services.PlatilloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marca esta clase como un componente de servicio, Spring la gestionará.
public class PlatilloServiceImpl implements PlatilloService {

    @Autowired // Inyecta el repositorio para poder interactuar con la base de datos.
    private PlatilloRepository platilloRepository;

    @Override
    @Transactional(readOnly = true) // Transacción de solo lectura, es más eficiente.
    public List<Platillo> findAll() {
        return platilloRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Platillo> findById(Integer id) {
        return platilloRepository.findById(id);
    }

    @Override
    @Transactional // Transacción de escritura (lectura y escritura).
    public Platillo save(Platillo platillo) {
        // Aquí podrías añadir lógica de negocio, ej: validar que el precio no sea negativo.
        return platilloRepository.save(platillo);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        platilloRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Platillo> findByCategoria(String categoria) {
        return platilloRepository.findByCategoria(categoria);
    }
}