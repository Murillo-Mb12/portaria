package com.portaria.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.portaria.entities.Acesso;

public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    // Consulta e relatório: o período é filtrado no banco (índice em "entrada").
    // O @EntityGraph traz visitante, morador e veículo no mesmo SELECT (evita uma consulta por linha).
    @EntityGraph(attributePaths = { "visitante", "morador", "veiculo" })
    @Query("SELECT a FROM Acesso a WHERE a.entrada >= :inicio AND a.entrada < :fim ORDER BY a.entrada DESC")
    List<Acesso> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    // Quem está dentro agora (sem saída registrada)
    @EntityGraph(attributePaths = { "visitante", "morador", "veiculo" })
    List<Acesso> findBySaidaIsNullOrderByEntradaDesc();

    // Visitante / veículo / pessoa (pelo CPF) já está dentro?
    boolean existsByVisitanteIdAndSaidaIsNull(Long visitanteId);

    boolean existsByVeiculoIdAndSaidaIsNull(Long veiculoId);

    boolean existsByDocumentoAndSaidaIsNull(String documento);

    boolean existsByVisitanteId(Long visitanteId);

    boolean existsByMoradorId(Long moradorId);

    boolean existsByVeiculoId(Long veiculoId);
}
