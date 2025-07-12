package com.example.restaurante_back.controllers;

import com.example.restaurante_back.dto.UsuarioDTO;
import com.example.restaurante_back.models.Usuario;
import com.example.restaurante_back.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * EN UN ENTORNO REAL: Este endpoint debería estar protegido
     * y solo ser accesible por administradores.
     */
    @GetMapping
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioService.findAll();
    }

    /**
     * EN UN ENTORNO REAL: El endpoint para crear un usuario (registro)
     * no debería estar aquí, sino en un /api/auth/register, por ejemplo.
     * Además, la contraseña DEBE ser encriptada antes de guardarse.
     */
    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody Usuario usuario) {
        // Lógica de encriptación de contraseña (ej. BCryptPasswordEncoder) iría aquí, en el servicio.
        UsuarioDTO nuevoUsuario = usuarioService.save(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioDetails) {
        return usuarioService.findById(id)
                .map(usuarioDTO -> {
                    // Crear una nueva entidad Usuario con los datos actualizados
                    Usuario usuario = new Usuario();
                    usuario.setId(id);
                    usuario.setNombre(usuarioDetails.getNombre());
                    usuario.setApellido(usuarioDetails.getApellido());
                    usuario.setUsername(usuarioDetails.getUsername());
                    usuario.setEmail(usuarioDetails.getEmail());
                    usuario.setTelefono(usuarioDetails.getTelefono());
                    usuario.setEnabled(usuarioDetails.isEnabled());
                    
                    // Manejar la contraseña: si no se proporciona una nueva, mantener la existente
                    if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isEmpty()) {
                        usuario.setPassword(usuarioDetails.getPassword());
                    } else {
                        // Obtener la contraseña actual del usuario existente
                        usuario.setPassword(usuarioService.getPasswordById(id));
                    }
                    
                    // Pasa los roles recibidos al usuario para que el servicio los procese
                    usuario.setRoles(usuarioDetails.getRoles());
                    return ResponseEntity.ok(usuarioService.save(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        if (usuarioService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}