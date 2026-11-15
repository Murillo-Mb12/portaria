package com.portaria.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    // Lista ordenada pela placa, já com as pessoas de cada veículo (um SELECT só)
    @EntityGraph(attributePaths = "pessoas")
    List<Veiculo> findAllByOrderByPlacaAsc();

    boolean existsByPlaca(String placa);

    boolean existsByPlacaAndIdNot(String placa, Long id);

    // O visitante está vinculado a algum veículo?
    boolean existsByPessoasId(Long visitanteId);
}
