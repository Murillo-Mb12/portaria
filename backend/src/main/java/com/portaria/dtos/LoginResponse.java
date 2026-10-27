package com.portaria.dtos;

import com.portaria.entities.enums.Perfil;

public record LoginResponse(
        Long id,
        String nome,
        Perfil perfil) {
}
