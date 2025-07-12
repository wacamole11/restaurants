package com.example.restaurante_back.repositories;

import com.example.restaurante_back.models.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Integer> {

    /**
     * Busca todas las mesas que tienen un estado específico.
     * Útil para encontrar solo las mesas 'disponibles'.
     * @param estado El estado a buscar (ej. "disponible", "ocupada").
     * @return Una lista de mesas que coinciden con el estado.
     */
    List<Mesa> findByEstado(String estado);

    /**
     * Busca todas las mesas con una capacidad mayor o igual a un número dado.
     * Útil para una búsqueda de reserva: "necesito una mesa para 5 personas".
     * @param capacidad El número mínimo de asientos requeridos.
     * @return Una lista de mesas que cumplen con la capacidad.
     */
    List<Mesa> findByCapacidadGreaterThanEqual(int capacidad);
}