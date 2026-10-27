package com.portaria.dtos;

import com.portaria.entities.enums.FinalidadeAcesso;
import com.portaria.entities.enums.ObjetivoAcesso;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Campos usados conforme o objetivo:
 *   VISITA -> visitanteId + moradorId
 *   DOACAO -> nome + descricao (itens doados)
 *   OUTROS -> nome + finalidade (+ descricao opcional)
 * veiculoId é sempre opcional (pessoa chegou com veículo).
 * As regras condicionais ficam no AcessoService.
 */
public record EntradaRequest(
        @NotNull(message = "Informe o objetivo da entrada")
        ObjetivoAcesso objetivo,

        Long visitanteId,
        Long moradorId,
        Long veiculoId,

        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @Size(max = 20, message = "O documento deve ter no máximo 20 caracteres")
        String documento,

        FinalidadeAcesso finalidade,

        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
        String descricao) {
}
