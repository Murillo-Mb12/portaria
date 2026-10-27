package com.portaria.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    boolean existsByPlaca(String placa);

    boolean existsByPlacaAndIdNot(String placa, Long id);

    // O visitante está vinculado a algum veículo?
    boolean existsByPessoasId(Long visitanteId);
}
