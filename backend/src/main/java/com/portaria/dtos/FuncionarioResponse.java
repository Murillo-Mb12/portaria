package com.portaria.dtos;

import com.portaria.entities.enums.Perfil;

// Repare: a senha NÃO sai na resposta. Esse é um dos motivos de usar DTOs.
public record FuncionarioResponse(
        Long id,
        String nome,
        String usuario,
        Perfil perfil) {
}
