package com.portaria.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Acesso;

public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    List<Acesso> findAllByOrderByEntradaDesc();

    // Quem está dentro agora (sem saída registrada)
    List<Acesso> findBySaidaIsNullOrderByEntradaDesc();

    // Visitante / veículo já está dentro?
    boolean existsByVisitanteIdAndSaidaIsNull(Long visitanteId);

    boolean existsByVeiculoIdAndSaidaIsNull(Long veiculoId);

    boolean existsByVisitanteId(Long visitanteId);

    boolean existsByMoradorId(Long moradorId);

    boolean existsByVeiculoId(Long veiculoId);
}
