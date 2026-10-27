package com.portaria.dtos;

import java.util.List;

import com.portaria.entities.enums.TipoVeiculo;

public record VeiculoResponse(
        Long id,
        String placa,
        String marca,
        String modelo,
        String cor,
        TipoVeiculo tipo,
        String responsavel,
        List<PessoaResumo> pessoas) {
}
