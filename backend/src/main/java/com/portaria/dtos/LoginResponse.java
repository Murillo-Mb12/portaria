package com.portaria.dtos;

import com.portaria.entities.enums.Perfil;

/** Dados de quem entrou + o token que o front-end manda em toda chamada à API. */
public record LoginResponse(
        Long id,
        String nome,
        Perfil perfil,
        String token) {
}
