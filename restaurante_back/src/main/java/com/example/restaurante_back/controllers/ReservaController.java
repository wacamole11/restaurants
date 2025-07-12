package com.example.restaurante_back.controllers;

import com.example.restaurante_back.dto.ReservaDTO;
import com.example.restaurante_back.dto.CreateReservaDTO;
import com.example.restaurante_back.services.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;

// DTO para cancelar reserva
class CancelarReservaRequest {
    public String canceladaPor; // USUARIO o ADMIN
}

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<ReservaDTO> getAllReservas() {
        return reservaService.findAll();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ReservaDTO> getReservasByUsuario(@PathVariable Integer usuarioId) {
        return reservaService.findByUsuarioId(usuarioId);
    }

    /**
     * Endpoint para crear una nueva reserva.
     * La lógica de validación (ej. si la mesa está disponible)
     * debería estar dentro del 'reservaService'.
     */
    @PostMapping
    public ResponseEntity<ReservaDTO> createReserva(@RequestBody CreateReservaDTO createReservaDTO) {
        try {
            ReservaDTO nuevaReserva = reservaService.create(createReservaDTO);
            return new ResponseEntity<>(nuevaReserva, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> getReservaById(@PathVariable Integer id) {
        return reservaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ReservaDTO> cancelarReserva(@PathVariable Integer id, @RequestBody CancelarReservaRequest request) {
        try {
            ReservaDTO reservaCancelada = reservaService.cancelarReserva(id, request.canceladaPor);
            return ResponseEntity.ok(reservaCancelada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Integer id) {
        if (reservaService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        reservaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}