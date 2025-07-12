package com.example.restaurante_back.controllers;

import com.example.restaurante_back.models.Mesa;
import com.example.restaurante_back.services.MesaService; // ¡Asegúrate de crear este servicio!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private MesaService mesaService; // Necesitarás crear MesaService y MesaServiceImpl

    @GetMapping
    public List<Mesa> getAllMesas() {
        return mesaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mesa> getMesaById(@PathVariable Integer id) {
        return mesaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Mesa> createMesa(@RequestBody Mesa mesa) {
        return new ResponseEntity<>(mesaService.save(mesa), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mesa> updateMesa(@PathVariable Integer id, @RequestBody Mesa mesaDetails) {
        return mesaService.findById(id)
                .map(mesa -> {
                    mesa.setNumeroMesa(mesaDetails.getNumeroMesa());
                    mesa.setCapacidad(mesaDetails.getCapacidad());
                    mesa.setDescripcion(mesaDetails.getDescripcion());
                    mesa.setEstado(mesaDetails.getEstado());
                    mesa.setFotoUrl(mesaDetails.getFotoUrl());
                    return ResponseEntity.ok(mesaService.save(mesa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMesa(@PathVariable Integer id) {
        if (mesaService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        mesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}