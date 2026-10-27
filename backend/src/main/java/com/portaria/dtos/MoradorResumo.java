package com.portaria.dtos;

/** Versão curta do morador, usada dentro de outros DTOs. */
public record MoradorResumo(
        Long id,
        String nome,
        String unidade) {
}
