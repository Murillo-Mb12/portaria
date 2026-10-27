package com.portaria.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Visitante;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {

    // Algum visitante está vinculado a este morador?
    boolean existsByMoradoresId(Long moradorId);

    boolean existsByDocumento(String documento);

    boolean existsByDocumentoAndIdNot(String documento, Long id);
}
