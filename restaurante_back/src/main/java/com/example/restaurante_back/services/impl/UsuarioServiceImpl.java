package com.example.restaurante_back.services.impl;

import com.example.restaurante_back.dto.UsuarioDTO;
import com.example.restaurante_back.models.Usuario;
import com.example.restaurante_back.repositories.UsuarioRepository;
import com.example.restaurante_back.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.restaurante_back.repositories.RolRepository;
import com.example.restaurante_back.models.Rol;
import java.util.Set;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    // Si tuvieras Spring Security, aquí inyectarías el PasswordEncoder:
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findById(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public UsuarioDTO save(Usuario usuario) {
        // Si es una actualización (tiene ID), manejar roles de forma especial
        if (usuario.getId() != null) {
            // Obtener el usuario existente
            Usuario usuarioExistente = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuario.getId()));
            
            // Actualizar campos básicos
            usuarioExistente.setNombre(usuario.getNombre());
            usuarioExistente.setApellido(usuario.getApellido());
            usuarioExistente.setUsername(usuario.getUsername());
            usuarioExistente.setEmail(usuario.getEmail());
            usuarioExistente.setTelefono(usuario.getTelefono());
            usuarioExistente.setEnabled(usuario.isEnabled());
            
            // Actualizar contraseña solo si se proporciona una nueva
            if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
                usuarioExistente.setPassword(usuario.getPassword());
            }
            
            // Manejar roles: limpiar roles existentes y agregar los nuevos
            if (usuario.getRoles() != null && !usuario.getRoles().isEmpty()) {
                Set<Rol> rolesPersistentes = usuario.getRoles().stream()
                    .map(rol -> rolRepository.findByNombre(rol.getNombre())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rol.getNombre())))
                    .collect(Collectors.toSet());
                usuarioExistente.setRoles(rolesPersistentes);
            } else {
                // Si no se proporcionan roles, limpiar todos los roles existentes
                usuarioExistente.setRoles(null);
            }
            
            Usuario savedUsuario = usuarioRepository.save(usuarioExistente);
            return convertToDTO(savedUsuario);
        } else {
            // Es una creación nueva
            // Asociar roles persistentes
            if (usuario.getRoles() != null && !usuario.getRoles().isEmpty()) {
                Set<Rol> rolesPersistentes = usuario.getRoles().stream()
                    .map(rol -> rolRepository.findByNombre(rol.getNombre())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rol.getNombre())))
                    .collect(Collectors.toSet());
                usuario.setRoles(rolesPersistentes);
            }
            // En un proyecto real, la encriptación de la contraseña iría aquí.
            // String encodedPassword = passwordEncoder.encode(usuario.getPassword());
            // usuario.setPassword(encodedPassword);
            Usuario savedUsuario = usuarioRepository.save(usuario);
            return convertToDTO(savedUsuario);
        }
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public String getPasswordById(Integer id) {
        return usuarioRepository.findById(id)
                .map(Usuario::getPassword)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    /**
     * Convierte una entidad Usuario a UsuarioDTO
     */
    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setEnabled(usuario.isEnabled());
        // Auditoría
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());
        dto.setUltimoLogin(usuario.getUltimoLogin());
        // Convertir roles a nombres de strings
        if (usuario.getRoles() != null) {
            List<String> rolesNombres = usuario.getRoles().stream()
                    .map(Rol::getNombre)
                    .collect(Collectors.toList());
            dto.setRoles(rolesNombres);
        }
        return dto;
    }
}