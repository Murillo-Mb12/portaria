package com.portaria.dtos;

import java.util.List;

import com.portaria.entities.enums.VinculoVisitante;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VisitanteRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "O documento (CPF/RG) é obrigatório")
        @Size(max = 20, message = "O documento deve ter no máximo 20 caracteres")
        String documento,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = ValidationPatterns.TELEFONE, message = "Telefone inválido")
        String telefone,

        @NotNull(message = "Informe o vínculo (familiar, cuidador ou amigo)")
        VinculoVisitante vinculo,

        @NotEmpty(message = "Selecione pelo menos um morador")
        List<Long> moradorIds) {
}
