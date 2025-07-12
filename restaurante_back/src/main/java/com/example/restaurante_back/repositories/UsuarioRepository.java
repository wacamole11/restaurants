package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca un usuario por su 'username'.
     * Fundamental para el proceso de login.
     * @param username El nombre de usuario a buscar.
     * @return Un Optional que contendrá el Usuario si se encuentra.
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Busca un usuario por su 'email'.
     * Útil para comprobar si un email ya está registrado.
     * @param email El correo electrónico a buscar.
     * @return Un Optional que contendrá el Usuario si se encuentra.
     */
    Optional<Usuario> findByEmail(String email);
}