package com.portaria.mappers;

import com.portaria.dtos.MoradorRequest;
import com.portaria.dtos.MoradorResponse;
import com.portaria.entities.Morador;

public class MoradorMapper {

    public static Morador toEntity(MoradorRequest request) {
        Morador morador = new Morador();
        morador.setNome(request.nome().trim());
        morador.setUnidade(request.unidade().trim());
        morador.setTelefone(request.telefone().trim());
        return morador;
    }

    public static MoradorResponse toDTO(Morador morador) {
        return new MoradorResponse(
                morador.getId(),
                morador.getNome(),
                morador.getUnidade(),
                morador.getTelefone());
    }
}
