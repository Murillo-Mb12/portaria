package com.portaria.entities.enums;

/** Motivo da ida ao Lar, escolhido na hora da entrada. */
public enum ObjetivoAcesso {
    VISITA("Visita"),   // parente, cuidador ou amigo de um morador
    DOACAO("Doação"),
    OUTROS("Outros");   // bazar, igreja, reunião, imprensa...

    private final String descricao;

    ObjetivoAcesso(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
