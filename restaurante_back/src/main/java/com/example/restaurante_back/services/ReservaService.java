package com.example.restaurante_back.services;

import com.example.restaurante_back.dto.ReservaDTO;
import com.example.restaurante_back.dto.CreateReservaDTO;
import com.example.restaurante_back.models.Reserva;
import java.util.List;
import java.util.Optional;

public interface ReservaService {
    List<ReservaDTO> findAll();
    Optional<ReservaDTO> findById(Integer id);
    ReservaDTO create(CreateReservaDTO createReservaDTO);
    ReservaDTO cancelarReserva(Integer id, String canceladaPor);
    void deleteById(Integer id);
    List<ReservaDTO> findByUsuarioId(Integer usuarioId);
}