package com.portaria.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MoradorRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "A unidade é obrigatória")
        @Size(max = 50, message = "A unidade deve ter no máximo 50 caracteres")
        String unidade,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = ValidationPatterns.TELEFONE, message = "Telefone inválido")
        String telefone) {
}
