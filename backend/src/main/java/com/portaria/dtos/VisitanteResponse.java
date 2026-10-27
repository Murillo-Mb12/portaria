package com.portaria.dtos;

import java.util.List;

import com.portaria.entities.enums.VinculoVisitante;

public record VisitanteResponse(
        Long id,
        String nome,
        String documento,
        String telefone,
        VinculoVisitante vinculo,
        List<MoradorResumo> moradores) {
}
