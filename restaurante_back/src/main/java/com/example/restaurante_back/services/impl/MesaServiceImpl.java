package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.models.Mesa;
import com.example.restaurante_back.repositories.MesaRepository;
import com.example.restaurante_back.services.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // <-- ¡ASEGÚRATE DE IMPORTAR ESTA!
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // <-- ¡ESTA ANOTACIÓN ES LA CLAVE! Le dice a Spring que esta es la implementación que debe usar.
public class MesaServiceImpl implements MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Mesa> findAll() {
        return mesaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Mesa> findById(Integer id) {
        return mesaRepository.findById(id);
    }

    @Override
    @Transactional
    public Mesa save(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        mesaRepository.deleteById(id);
    }
}