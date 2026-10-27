package com.portaria.mappers;

import java.util.Set;

import com.portaria.dtos.MoradorResumo;
import com.portaria.dtos.VisitanteRequest;
import com.portaria.dtos.VisitanteResponse;
import com.portaria.entities.Morador;
import com.portaria.entities.Visitante;

public class VisitanteMapper {

    // Os moradores são buscados no service (pelos ids) e recebidos aqui
    public static Visitante toEntity(VisitanteRequest request, Set<Morador> moradores) {
        Visitante visitante = new Visitante();
        visitante.setNome(request.nome().trim());
        visitante.setDocumento(request.documento().trim());
        visitante.setTelefone(request.telefone().trim());
        visitante.setVinculo(request.vinculo());
        visitante.setMoradores(moradores);
        return visitante;
    }

    public static VisitanteResponse toDTO(Visitante visitante) {
        return new VisitanteResponse(
                visitante.getId(),
                visitante.getNome(),
                visitante.getDocumento(),
                visitante.getTelefone(),
                visitante.getVinculo(),
                visitante.getMoradores().stream()
                        .map(m -> new MoradorResumo(m.getId(), m.getNome(), m.getUnidade()))
                        .toList());
    }
}
