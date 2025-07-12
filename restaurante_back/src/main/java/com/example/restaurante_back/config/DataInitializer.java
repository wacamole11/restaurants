package com.example.restaurante_back.config;

import com.example.restaurante_back.models.Rol;
import com.example.restaurante_back.repositories.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar roles básicos si no existen
        initializeRoles();
    }

    private void initializeRoles() {
        // Crear rol ADMIN si no existe
        if (!rolRepository.findByNombre("ADMIN").isPresent()) {
            Rol adminRol = new Rol();
            adminRol.setNombre("ADMIN");
            adminRol.setDescripcion("Administrador del sistema");
            rolRepository.save(adminRol);
            System.out.println("Rol ADMIN creado");
        }

        // Crear rol USER si no existe
        if (!rolRepository.findByNombre("USER").isPresent()) {
            Rol userRol = new Rol();
            userRol.setNombre("USER");
            userRol.setDescripcion("Usuario del sistema");
            rolRepository.save(userRol);
            System.out.println("Rol USER creado");
        }
    }
} 