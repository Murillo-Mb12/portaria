package com.portaria.dtos;

import com.portaria.entities.enums.Perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * senha: obrigatória no cadastro. Na edição pode vir nula (ou vazia): a senha atual é mantida.
 * Essa regra condicional fica no FuncionarioService.
 */
public record FuncionarioRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "O usuário é obrigatório")
        @Size(min = 3, max = 50, message = "O usuário deve ter entre 3 e 50 caracteres")
        String usuario,

        @Pattern(regexp = "^$|^(?=.*[A-Za-zÀ-ÿ])(?=.*\\d).{8,100}$",
                message = "A senha deve ter pelo menos 8 caracteres, com letras e números")
        String senha,

        @NotNull(message = "O perfil é obrigatório")
        Perfil perfil) {
}
