package com.portaria.mappers;

import com.portaria.dtos.PessoaResumo;
import com.portaria.dtos.VeiculoResponse;
import com.portaria.entities.Veiculo;

public class VeiculoMapper {

    // A conversão Request -> entidade fica no VeiculoService,
    // porque depende das regras do tipo (pessoas x responsável).

    public static VeiculoResponse toDTO(Veiculo veiculo) {
        return new VeiculoResponse(
                veiculo.getId(),
                veiculo.getPlaca(),
                veiculo.getMarca(),
                veiculo.getModelo(),
                veiculo.getCor(),
                veiculo.getTipo(),
                veiculo.getResponsavel(),
                veiculo.getPessoas().stream()
                        .map(p -> new PessoaResumo(p.getId(), p.getNome()))
                        .toList());
    }

    // "abc-1d23" -> "ABC1D23"
    public static String normalizarPlaca(String placa) {
        return placa.trim().replace("-", "").toUpperCase();
    }

    // "FJK2B31 - Fiat Uno (Prata)"
    public static String descricaoCurta(Veiculo v) {
        return v.getPlaca() + " - " + v.getMarca() + " " + v.getModelo() + " (" + v.getCor() + ")";
    }
}
