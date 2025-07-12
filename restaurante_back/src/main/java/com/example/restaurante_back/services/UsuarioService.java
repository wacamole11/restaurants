package com.example.restaurante_back.services;

import com.example.restaurante_back.dto.UsuarioDTO;
import com.example.restaurante_back.models.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<UsuarioDTO> findAll();
    Optional<UsuarioDTO> findById(Integer id);
    UsuarioDTO save(Usuario usuario);
    void deleteById(Integer id);
    Optional<UsuarioDTO> findByUsername(String username);
    String getPasswordById(Integer id);
}