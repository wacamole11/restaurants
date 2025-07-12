package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.models.Reserva;
import com.example.restaurante_back.models.Platillo;
import com.example.restaurante_back.models.Mesa;
import com.example.restaurante_back.repositories.ReservaRepository;
import com.example.restaurante_back.repositories.PlatilloRepository;
import com.example.restaurante_back.repositories.MesaRepository;
import com.example.restaurante_back.services.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Implementación de ReporteService para la generación de reportes administrativos.
 */
@Service
public class ReporteServiceImpl implements ReporteService {
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private PlatilloRepository platilloRepository;
    @Autowired
    private MesaRepository mesaRepository;

    @Override
    public List<Reserva> getReservasPorFecha(LocalDate fecha) {
        // Ejemplo: deberías implementar un método personalizado en ReservaRepository
        return reservaRepository.findAll();
    }

    @Override
    public List<Platillo> getPlatillosMasPedidos() {
        // Ejemplo: deberías implementar lógica personalizada en PlatilloRepository
        return platilloRepository.findAll();
    }

    @Override
    public List<Mesa> getOcupacionMesas() {
        // Ejemplo: deberías implementar lógica personalizada en MesaRepository
        return mesaRepository.findAll();
    }
} 