package com.example.restaurante_back.controllers;


import com.example.restaurante_back.models.Platillo;
import com.example.restaurante_back.services.PlatilloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase es un controlador REST.
@RequestMapping("/api/platillos") // Todas las URLs de este controlador empezarán con /api/platillos.
public class PlatilloController {

    @Autowired
    private PlatilloService platilloService;

    /**
     * Endpoint para obtener todos los platillos.
     * HTTP GET /api/platillos
     */
    @GetMapping
    public List<Platillo> getAllPlatillos() {
        return platilloService.findAll();
    }

    /**
     * Endpoint para obtener un platillo por su ID.
     * HTTP GET /api/platillos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Platillo> getPlatilloById(@PathVariable Integer id) {
        return platilloService.findById(id)
                .map(ResponseEntity::ok) // Si lo encuentra, devuelve 200 OK con el platillo.
                .orElse(ResponseEntity.notFound().build()); // Si no, devuelve 404 Not Found.
    }

    /**
     * Endpoint para crear un nuevo platillo.
     * HTTP POST /api/platillos
     */
    @PostMapping
    public ResponseEntity<Platillo> createPlatillo(@RequestBody Platillo platillo) {
        Platillo nuevoPlatillo = platilloService.save(platillo);
        return new ResponseEntity<>(nuevoPlatillo, HttpStatus.CREATED); // Devuelve 201 Created.
    }

    /**
     * Endpoint para actualizar un platillo existente.
     * HTTP PUT /api/platillos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Platillo> updatePlatillo(@PathVariable Integer id, @RequestBody Platillo platilloDetails) {
        return platilloService.findById(id)
                .map(platillo -> {
                    platillo.setNombre(platilloDetails.getNombre());
                    platillo.setDescripcion(platilloDetails.getDescripcion());
                    platillo.setPrecio(platilloDetails.getPrecio());
                    platillo.setCategoria(platilloDetails.getCategoria());
                    platillo.setDisponible(platilloDetails.isDisponible());
                    return ResponseEntity.ok(platilloService.save(platillo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para eliminar un platillo.
     * HTTP DELETE /api/platillos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlatillo(@PathVariable Integer id) {
        return platilloService.findById(id)
                .map(platillo -> {
                    platilloService.deleteById(id);
                    return ResponseEntity.noContent().<Void>build(); // Devuelve 204 No Content.
                })
                .orElse(ResponseEntity.notFound().build());
    }
}