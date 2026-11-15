package com.portaria.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Informe o usuário")
        @Size(max = 50, message = "Usuário ou senha inválidos.")
        String usuario,

        @NotBlank(message = "Informe a senha")
        @Size(max = 100, message = "Usuário ou senha inválidos.")
        String senha) {
}
