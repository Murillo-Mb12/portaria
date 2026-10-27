package com.portaria.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Morador;

public interface MoradorRepository extends JpaRepository<Morador, Long> {
}
