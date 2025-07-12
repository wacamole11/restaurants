package com.example.restaurante_back.controllers;

import com.example.restaurante_back.dto.LoginResponseDTO;
import com.example.restaurante_back.dto.RegisterRequest;
import com.example.restaurante_back.models.Usuario;
import com.example.restaurante_back.models.Rol;
import com.example.restaurante_back.repositories.UsuarioRepository;
import com.example.restaurante_back.repositories.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {
        try {
            // Busca el usuario por username
            Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Valida la contraseña (en un sistema real, la contraseña debe estar encriptada)
            if (!usuario.getPassword().equals(loginRequest.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Contraseña incorrecta");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Crear DTO de respuesta para evitar problemas de serialización con Hibernate
            LoginResponseDTO responseDTO = new LoginResponseDTO();
            responseDTO.setId(usuario.getId());
            responseDTO.setUsername(usuario.getUsername());
            responseDTO.setNombre(usuario.getNombre());
            responseDTO.setApellido(usuario.getApellido());
            responseDTO.setEmail(usuario.getEmail());
            responseDTO.setTelefono(usuario.getTelefono());
            responseDTO.setEnabled(usuario.isEnabled());

            // Convertir roles a nombres de strings para evitar problemas de serialización
            if (usuario.getRoles() != null) {
                responseDTO.setRoles(usuario.getRoles().stream()
                        .map(rol -> rol.getNombre())
                        .collect(Collectors.toSet()));
            }

            return ResponseEntity.ok(responseDTO);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validaciones básicas
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El username es obligatorio");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La contraseña es obligatoria");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El nombre es obligatorio");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El email es obligatorio");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Verificar si el usuario ya existe
            if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El usuario ya existe");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El email ya está registrado");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            // Crear el usuario
            Usuario usuario = new Usuario();
            usuario.setUsername(request.getUsername());
            usuario.setPassword(request.getPassword());
            usuario.setNombre(request.getNombre());
            usuario.setEmail(request.getEmail());
            usuario.setApellido(request.getApellido());
            usuario.setTelefono(request.getTelefono());
            usuario.setEnabled(request.isEnabled());

            // Asignar rol de USER por defecto
            Rol rolUser = rolRepository.findByNombre("USER")
                    .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
            usuario.addRol(rolUser);

            // Guardar el usuario
            Usuario savedUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUsuario);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al registrar el usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}