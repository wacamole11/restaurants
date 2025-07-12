package com.example.restaurante_back.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
// Importa los modelos y servicios necesarios
import com.example.restaurante_back.models.Pedido;
import com.example.restaurante_back.services.PedidoService;
import com.example.restaurante_back.dto.PedidoDTO;
import com.example.restaurante_back.dto.CreatePedidoDTO;

/**
 * Controlador REST para la gestión de pedidos en el restaurante.
 * Proporciona endpoints para crear, leer, actualizar y eliminar pedidos.
 */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<PedidoDTO> getAllPedidos() {
        return pedidoService.findAllDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> getPedidoById(@PathVariable Integer id) {
        return pedidoService.findByIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<PedidoDTO> getPedidosByUsuario(@PathVariable Integer usuarioId) {
        return pedidoService.findByUsuarioIdDTO(usuarioId);
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> createPedido(@RequestBody CreatePedidoDTO createPedidoDTO) {
        PedidoDTO pedidoDTO = pedidoService.createFromDTO(createPedidoDTO);
        return new ResponseEntity<>(pedidoDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> updatePedido(@PathVariable Integer id, @RequestBody Pedido pedidoDetails) {
        return pedidoService.findById(id)
                .map(pedido -> {
                    // Solo actualizar campos específicos, no las relaciones
                    if (pedidoDetails.getEstado() != null) {
                        pedido.setEstado(pedidoDetails.getEstado());
                    }
                    if (pedidoDetails.getFechaCierre() != null) {
                        pedido.setFechaCierre(pedidoDetails.getFechaCierre());
                    }
                    if (pedidoDetails.getTotal() != null) {
                        pedido.setTotal(pedidoDetails.getTotal());
                    }
                    
                    Pedido pedidoActualizado = pedidoService.save(pedido);
                    PedidoDTO pedidoDTO = pedidoService.convertToDTO(pedidoActualizado);
                    return ResponseEntity.ok(pedidoDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
        if (pedidoService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        pedidoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 