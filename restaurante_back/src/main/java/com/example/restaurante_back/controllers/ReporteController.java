package com.example.restaurante_back.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.time.LocalDate;
// Importa los servicios necesarios
import com.example.restaurante_back.services.ReporteService;
import com.example.restaurante_back.models.Platillo;
import com.example.restaurante_back.models.Mesa;
import com.example.restaurante_back.models.Reserva;

/**
 * Controlador REST para la generación de reportes administrativos.
 * Proporciona endpoints para reportes de reservas por fecha, platillos más pedidos y ocupación de mesas.
 */
@RestController
@RequestMapping("/api/reportes")
public class ReporteController {
    @Autowired
    private ReporteService reporteService;

    @GetMapping("/reservas-por-fecha")
    public List<Reserva> getReservasPorFecha(@RequestParam("fecha") String fecha) {
        return reporteService.getReservasPorFecha(LocalDate.parse(fecha));
    }

    @GetMapping("/platillos-mas-pedidos")
    public List<Platillo> getPlatillosMasPedidos() {
        return reporteService.getPlatillosMasPedidos();
    }

    @GetMapping("/ocupacion-mesas")
    public List<Mesa> getOcupacionMesas() {
        return reporteService.getOcupacionMesas();
    }
} 