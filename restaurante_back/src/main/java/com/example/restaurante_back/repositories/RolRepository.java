package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    /**
     * Busca un rol por su nombre.
     * Esencial para cuando un nuevo usuario se registra y necesitas asignarle el rol 'ROLE_USER'.
     * @param nombre El nombre del rol a buscar.
     * @return Un Optional que contendrá el Rol si se encuentra.
     */
    Optional<Rol> findByNombre(String nombre);
}