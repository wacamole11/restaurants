package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.models.Pedido;
import com.example.restaurante_back.models.PedidoPlatillo;
import com.example.restaurante_back.repositories.PedidoRepository;
import com.example.restaurante_back.repositories.PlatilloRepository;
import com.example.restaurante_back.repositories.ReservaRepository;
import com.example.restaurante_back.repositories.UsuarioRepository;
import com.example.restaurante_back.repositories.MesaRepository;
import com.example.restaurante_back.services.PedidoService;
import com.example.restaurante_back.dto.PedidoDTO;
import com.example.restaurante_back.dto.PedidoPlatilloDTO;
import com.example.restaurante_back.dto.CreatePedidoDTO;
import com.example.restaurante_back.models.Mesa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación de PedidoService para la gestión de pedidos.
 */
@Service
public class PedidoServiceImpl implements PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PlatilloRepository platilloRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Optional<Pedido> findById(Integer id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public Pedido save(Pedido pedido) {
        // Asociar la reserva completa si solo viene el id
        if (pedido.getReserva() != null && pedido.getReserva().getId() != null) {
            var reserva = reservaRepository.findById(pedido.getReserva().getId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            // Validar que la reserva no esté cancelada
            if ("CANCELADA".equalsIgnoreCase(reserva.getEstado())) {
                throw new RuntimeException("No se puede crear un pedido para una reserva cancelada");
            }
            
            // Validar que la reserva esté confirmada
            if (!"CONFIRMADA".equalsIgnoreCase(reserva.getEstado())) {
                throw new RuntimeException("Solo se pueden crear pedidos para reservas confirmadas");
            }
            
            pedido.setReserva(reserva);
            // Establecer la hora de entrega programada basada en la fecha de la reserva
            pedido.setHoraEntregaProgramada(reserva.getFechaReserva());
            
            // Asociar la mesa de la reserva si no está establecida
            if (pedido.getMesa() == null && reserva.getMesa() != null) {
                pedido.setMesa(reserva.getMesa());
            }
        }
        
        // Asociar el usuario completo si solo viene el id
        if (pedido.getUsuario() != null && pedido.getUsuario().getId() != null) {
            pedido.setUsuario(
                usuarioRepository.findById(pedido.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
            );
        }
        
        // Asociar los platillos completos si solo vienen los ids
        if (pedido.getDetalles() != null) {
            for (PedidoPlatillo detalle : pedido.getDetalles()) {
                if (detalle.getPlatillo() != null && detalle.getPlatillo().getId() != null) {
                    detalle.setPlatillo(
                        platilloRepository.findById(detalle.getPlatillo().getId())
                            .orElseThrow(() -> new RuntimeException("Platillo no encontrado"))
                    );
                }
                // Establecer la referencia al pedido
                detalle.setPedido(pedido);
            }
        }
        
        return pedidoRepository.save(pedido);
    }

    @Override
    public PedidoDTO createFromDTO(CreatePedidoDTO createPedidoDTO) {
        Pedido pedido = new Pedido();
        
        // Asociar la reserva
        if (createPedidoDTO.getReservaId() != null) {
            var reserva = reservaRepository.findById(createPedidoDTO.getReservaId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            // Validar que la reserva no esté cancelada
            if ("CANCELADA".equalsIgnoreCase(reserva.getEstado())) {
                throw new RuntimeException("No se puede crear un pedido para una reserva cancelada");
            }
            
            // Validar que la reserva esté confirmada
            if (!"CONFIRMADA".equalsIgnoreCase(reserva.getEstado())) {
                throw new RuntimeException("Solo se pueden crear pedidos para reservas confirmadas");
            }
            
            pedido.setReserva(reserva);
            pedido.setHoraEntregaProgramada(reserva.getFechaReserva());
            
            // Asociar la mesa de la reserva
            pedido.setMesa(reserva.getMesa());
        }
        
        // Asociar la mesa directamente si se proporciona
        if (createPedidoDTO.getMesaId() != null && pedido.getMesa() == null) {
            Mesa mesa = mesaRepository.findById(createPedidoDTO.getMesaId())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
            pedido.setMesa(mesa);
        }
        
        // Asociar el usuario
        if (createPedidoDTO.getUsuarioId() != null) {
            pedido.setUsuario(
                usuarioRepository.findById(createPedidoDTO.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
            );
        }
        
        // Establecer otros campos
        pedido.setTotal(createPedidoDTO.getTotal());
        pedido.setEstado(createPedidoDTO.getEstado() != null ? createPedidoDTO.getEstado() : "en_proceso");
        pedido.setHoraEntregaProgramada(createPedidoDTO.getHoraEntregaProgramada());
        
        // Asociar los detalles
        if (createPedidoDTO.getDetalles() != null) {
            for (CreatePedidoDTO.CreatePedidoPlatilloDTO detalleDTO : createPedidoDTO.getDetalles()) {
                PedidoPlatillo detalle = new PedidoPlatillo();
                detalle.setPedido(pedido);
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                
                if (detalleDTO.getPlatilloId() != null) {
                    detalle.setPlatillo(
                        platilloRepository.findById(detalleDTO.getPlatilloId())
                            .orElseThrow(() -> new RuntimeException("Platillo no encontrado"))
                    );
                }
                
                if (pedido.getDetalles() == null) {
                    pedido.setDetalles(new java.util.ArrayList<>());
                }
                pedido.getDetalles().add(detalle);
            }
        }
        
        Pedido savedPedido = pedidoRepository.save(pedido);
        return convertToDTO(savedPedido);
    }

    @Override
    public void deleteById(Integer id) {
        pedidoRepository.deleteById(id);
    }
    
    // Implementación de métodos DTO
    @Override
    public List<PedidoDTO> findAllDTO() {
        return pedidoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<PedidoDTO> findByIdDTO(Integer id) {
        return pedidoRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    @Override
    public List<PedidoDTO> findByUsuarioIdDTO(Integer usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PedidoDTO convertToDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setTotal(pedido.getTotal());
        dto.setEstado(pedido.getEstado());
        dto.setFechaCreacion(pedido.getFechaCreacion());
        dto.setFechaCierre(pedido.getFechaCierre());
        dto.setHoraEntregaProgramada(pedido.getHoraEntregaProgramada());
        dto.setCanceladoPorReserva(pedido.getCanceladoPorReserva());
        
        // Datos de la reserva
        if (pedido.getReserva() != null) {
            dto.setReservaId(pedido.getReserva().getId());
            dto.setFechaReserva(pedido.getReserva().getFechaReserva());
            dto.setNumPersonas(pedido.getReserva().getNumPersonas());
            dto.setEstadoReserva(pedido.getReserva().getEstado());
            // Agregar el nombre de la mesa de la reserva
            if (pedido.getReserva().getMesa() != null) {
                dto.setReservaMesaNombre("Mesa " + pedido.getReserva().getMesa().getNumeroMesa());
            }
        }
        
        // Datos de la mesa
        if (pedido.getMesa() != null) {
            dto.setMesaId(pedido.getMesa().getId());
            dto.setMesaNombre(pedido.getMesa().getNumeroMesa());
            dto.setMesaCapacidad(pedido.getMesa().getCapacidad());
        }
        
        // Datos del usuario
        if (pedido.getUsuario() != null) {
            dto.setUsuarioId(pedido.getUsuario().getId());
            dto.setUsuarioNombre(pedido.getUsuario().getNombre());
            dto.setUsuarioEmail(pedido.getUsuario().getEmail());
        }
        
        // Datos de los detalles
        if (pedido.getDetalles() != null) {
            dto.setDetalles(pedido.getDetalles().stream()
                    .map(this::convertDetalleToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private PedidoPlatilloDTO convertDetalleToDTO(PedidoPlatillo detalle) {
        PedidoPlatilloDTO dto = new PedidoPlatilloDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        
        if (detalle.getPlatillo() != null) {
            dto.setPlatilloId(detalle.getPlatillo().getId());
            dto.setPlatilloNombre(detalle.getPlatillo().getNombre());
            dto.setPlatilloCategoria(detalle.getPlatillo().getCategoria());
        }
        
        return dto;
    }
} 