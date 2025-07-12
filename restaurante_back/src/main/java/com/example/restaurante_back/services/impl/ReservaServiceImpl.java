package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.dto.ReservaDTO;
import com.example.restaurante_back.dto.CreateReservaDTO;
import com.example.restaurante_back.models.Mesa;
import com.example.restaurante_back.models.Reserva;
import com.example.restaurante_back.models.Usuario;
import com.example.restaurante_back.repositories.MesaRepository;
import com.example.restaurante_back.repositories.ReservaRepository;
import com.example.restaurante_back.repositories.UsuarioRepository;
import com.example.restaurante_back.services.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.LocalTime;
import com.example.restaurante_back.repositories.PedidoRepository;
import com.example.restaurante_back.models.Pedido;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTO> findAll() {
        return reservaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReservaDTO> findById(Integer id) {
        return reservaRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public ReservaDTO create(CreateReservaDTO createReservaDTO) {
        // Buscar el usuario
        Usuario usuario = usuarioRepository.findById(createReservaDTO.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));

        // Buscar la mesa
        Mesa mesa = mesaRepository.findById(createReservaDTO.getMesaId())
                .orElseThrow(() -> new IllegalArgumentException("La mesa seleccionada no existe."));

        // Validar capacidad
        if (createReservaDTO.getNumPersonas() > mesa.getCapacidad()) {
            throw new IllegalArgumentException("El número de personas excede la capacidad de la mesa.");
        }

        if (!"disponible".equalsIgnoreCase(mesa.getEstado())) {
            throw new IllegalArgumentException("La mesa seleccionada no está disponible.");
        }

        // Validar horario de reserva (8:00 AM a 3:00 PM)
        LocalDateTime fechaReserva = createReservaDTO.getFechaReserva();
        LocalTime horaReserva = fechaReserva.toLocalTime();
        LocalTime horaInicio = LocalTime.of(8, 0); // 8:00 AM
        LocalTime horaFin = LocalTime.of(15, 0);   // 3:00 PM
        
        if (horaReserva.isBefore(horaInicio) || horaReserva.isAfter(horaFin)) {
            throw new IllegalArgumentException("Las reservas solo se permiten entre 8:00 AM y 3:00 PM.");
        }

        // Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setFechaReserva(createReservaDTO.getFechaReserva());
        reserva.setNumPersonas(createReservaDTO.getNumPersonas());
        reserva.setEstado("CONFIRMADA");
        reserva.setUsuario(usuario);
        reserva.setMesa(mesa);

        Reserva savedReserva = reservaRepository.save(reserva);
        return convertToDTO(savedReserva);
    }

    @Override
    @Transactional
    public ReservaDTO cancelarReserva(Integer id, String canceladaPor) {
        System.out.println("=== INICIANDO CANCELACIÓN DE RESERVA ID: " + id + " ===");
        
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La reserva no existe."));
        
        System.out.println("Reserva encontrada - Estado actual: " + reserva.getEstado());
        
        // Validar que la reserva no esté ya cancelada
        if ("CANCELADA".equalsIgnoreCase(reserva.getEstado())) {
            throw new IllegalArgumentException("La reserva ya está cancelada.");
        }
        
        // Cambiar el estado a cancelada y guardar quién la canceló
        reserva.setEstado("CANCELADA");
        reserva.setCanceladaPor(canceladaPor != null ? canceladaPor : "USUARIO");

        // Cancelar todos los pedidos asociados a la reserva
        java.util.List<Pedido> pedidos = pedidoRepository.findByReservaId(reserva.getId());
        System.out.println("Pedidos asociados a la reserva " + reserva.getId() + ": " + pedidos.size());
        
        if (pedidos.isEmpty()) {
            System.out.println("NO se encontraron pedidos asociados a la reserva " + reserva.getId());
        }
        
        for (Pedido pedido : pedidos) {
            System.out.println("Procesando pedido ID: " + pedido.getId() + 
                             ", estado actual: " + pedido.getEstado() + 
                             ", reserva_id: " + (pedido.getReserva() != null ? pedido.getReserva().getId() : "NULL"));
            
            if (!"cancelado".equalsIgnoreCase(pedido.getEstado())) {
                pedido.setEstado("cancelado");
                pedido.setFechaCierre(java.time.LocalDateTime.now());
                pedido.setCanceladoPorReserva(true);
                
                try {
                    Pedido savedPedido = pedidoRepository.save(pedido);
                    System.out.println("Pedido ID " + savedPedido.getId() + " cancelado exitosamente. Nuevo estado: " + savedPedido.getEstado());
                } catch (Exception e) {
                    System.err.println("Error al guardar pedido ID " + pedido.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Pedido ID " + pedido.getId() + " ya estaba cancelado, saltando...");
            }
        }

        Reserva savedReserva = reservaRepository.save(reserva);
        System.out.println("=== FINALIZADA CANCELACIÓN DE RESERVA ID: " + id + " ===");
        return convertToDTO(savedReserva);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        reservaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTO> findByUsuarioId(Integer usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad Reserva a ReservaDTO
     */
    private ReservaDTO convertToDTO(Reserva reserva) {
        ReservaDTO dto = new ReservaDTO();
        dto.setId(reserva.getId());
        dto.setFechaReserva(reserva.getFechaReserva());
        dto.setNumPersonas(reserva.getNumPersonas());
        dto.setEstado(reserva.getEstado());
        dto.setFechaCreacion(reserva.getFechaCreacion());
        dto.setCanceladaPor(reserva.getCanceladaPor());
        
        // Datos del usuario
        if (reserva.getUsuario() != null) {
            dto.setUsuarioId(reserva.getUsuario().getId());
            dto.setUsuarioNombre(reserva.getUsuario().getNombre());
            dto.setUsuarioEmail(reserva.getUsuario().getEmail());
        }
        
        // Datos de la mesa
        if (reserva.getMesa() != null) {
            dto.setMesaId(reserva.getMesa().getId());
            dto.setMesaNombre(reserva.getMesa().getNumeroMesa());
            dto.setMesaCapacidad(reserva.getMesa().getCapacidad());
        }
        
        return dto;
    }
}