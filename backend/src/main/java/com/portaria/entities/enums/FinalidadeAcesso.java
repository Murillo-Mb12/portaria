package com.portaria.entities.enums;

/** Detalha o objetivo OUTROS. */
public enum FinalidadeAcesso {
    BAZAR("Bazar"),
    IGREJA("Igreja"),
    REUNIAO("Reunião com a equipe"),
    IMPRENSA("Imprensa / entrevista"),
    OUTRO("Outro");

    private final String descricao;

    FinalidadeAcesso(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
