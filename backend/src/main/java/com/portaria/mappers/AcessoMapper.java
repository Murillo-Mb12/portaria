package com.portaria.mappers;

import com.portaria.dtos.AcessoResponse;
import com.portaria.entities.Acesso;

public class AcessoMapper {

    public static AcessoResponse toDTO(Acesso acesso) {
        String nome = acesso.getVisitante() != null ? acesso.getVisitante().getNome() : acesso.getNome();

        String detalhe = switch (acesso.getObjetivo()) {
            case VISITA -> "Visita a " + acesso.getMorador().getNome();
            case DOACAO -> acesso.getDescricao();
            case OUTROS -> acesso.getFinalidade().getDescricao()
                    + (acesso.getDescricao() != null ? ": " + acesso.getDescricao() : "");
        };

        String veiculo = acesso.getVeiculo() != null ? VeiculoMapper.descricaoCurta(acesso.getVeiculo()) : null;

        return new AcessoResponse(
                acesso.getId(),
                acesso.getObjetivo(),
                nome,
                detalhe,
                veiculo,
                acesso.getEntrada(),
                acesso.getSaida());
    }
}
