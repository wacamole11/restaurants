package com.example.restaurante_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.restaurante_back"})
public class RestauranteBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestauranteBackApplication.class, args);
    }

}
