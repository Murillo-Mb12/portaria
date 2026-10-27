package com.portaria.dtos;

import com.portaria.entities.enums.Perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FuncionarioRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "O usuário é obrigatório")
        @Size(min = 3, max = 50, message = "O usuário deve ter entre 3 e 50 caracteres")
        String usuario,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 4, max = 100, message = "A senha deve ter pelo menos 4 caracteres")
        String senha,

        @NotNull(message = "O perfil é obrigatório")
        Perfil perfil) {
}
