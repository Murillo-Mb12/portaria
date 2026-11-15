package com.portaria.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Visitante;

public interface VisitanteRepository extends JpaRepository<Visitante, Long> {

    // Lista em ordem alfabética, já com os moradores de cada visitante (um SELECT só)
    @EntityGraph(attributePaths = "moradores")
    List<Visitante> findAllByOrderByNomeAsc();

    // Algum visitante está vinculado a este morador?
    boolean existsByMoradoresId(Long moradorId);

    boolean existsByDocumento(String documento);

    boolean existsByDocumentoAndIdNot(String documento, Long id);
}
