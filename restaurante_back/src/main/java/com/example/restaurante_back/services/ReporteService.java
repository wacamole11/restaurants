package com.example.restaurante_back.services;

import com.example.restaurante_back.models.Reserva;
import com.example.restaurante_back.models.Platillo;
import com.example.restaurante_back.models.Mesa;
import java.time.LocalDate;
import java.util.List;

/**
 * Servicio para la generación de reportes administrativos.
 * Define las operaciones de negocio para reportes de reservas, platillos y ocupación de mesas.
 */
public interface ReporteService {
    List<Reserva> getReservasPorFecha(LocalDate fecha);
    List<Platillo> getPlatillosMasPedidos();
    List<Mesa> getOcupacionMesas();
} 