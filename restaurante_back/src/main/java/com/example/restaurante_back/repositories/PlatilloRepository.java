package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Platillo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Anotación que marca esta interfaz como un componente de repositorio de Spring.
public interface PlatilloRepository extends JpaRepository<Platillo, Integer> {

    // JpaRepository<Platillo, Integer>
    // Parámetro 1: 'Platillo' -> Es la clase de la entidad que este repositorio va a gestionar.
    // Parámetro 2: 'Integer'  -> Es el tipo de dato de la clave primaria (PK) de la entidad Platillo (el campo 'id').

    // --- MÉTODOS MÁGICOS (Query Methods) ---
    // Spring Data JPA puede crear consultas automáticamente basándose en el nombre del método.
    // Por ejemplo, para buscar platillos por categoría:

    /**
     * Busca todos los platillos que pertenecen a una categoría específica.
     * Spring entiende "findByCategoria" y genera la consulta SQL: "SELECT * FROM platillos WHERE categoria = ?"
     * @param categoria El nombre de la categoría a buscar.
     * @return Una lista de platillos que coinciden con la categoría.
     */
    List<Platillo> findByCategoria(String categoria);

    /**
     * Busca todos los platillos que están disponibles (o no).
     * @param disponible El estado de disponibilidad (true o false).
     * @return Una lista de platillos según su disponibilidad.
     */
    List<Platillo> findByDisponible(boolean disponible);
}