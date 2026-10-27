package com.portaria.dtos;

import java.util.List;

import com.portaria.entities.enums.TipoVeiculo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * tipo = VISITANTE          -> pessoaIds obrigatório (uma ou mais pessoas)
 * tipo = INSTITUICAO/OUTRO  -> responsavel obrigatório
 */
public record VeiculoRequest(
        @NotBlank(message = "A placa é obrigatória")
        @Pattern(regexp = ValidationPatterns.PLACA, message = "Placa inválida (use ABC1D23 ou ABC1234)")
        String placa,

        @NotBlank(message = "A marca é obrigatória")
        @Size(max = 40, message = "A marca deve ter no máximo 40 caracteres")
        String marca,

        @NotBlank(message = "O modelo é obrigatório")
        @Size(max = 40, message = "O modelo deve ter no máximo 40 caracteres")
        String modelo,

        @NotBlank(message = "A cor é obrigatória")
        @Size(max = 30, message = "A cor deve ter no máximo 30 caracteres")
        String cor,

        @NotNull(message = "O tipo é obrigatório")
        TipoVeiculo tipo,

        @Size(max = 100, message = "O responsável deve ter no máximo 100 caracteres")
        String responsavel,

        List<Long> pessoaIds) {
}
