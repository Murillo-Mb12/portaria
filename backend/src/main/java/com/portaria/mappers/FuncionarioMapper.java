package com.portaria.mappers;

import com.portaria.dtos.FuncionarioRequest;
import com.portaria.dtos.FuncionarioResponse;
import com.portaria.dtos.LoginResponse;
import com.portaria.entities.Funcionario;

public class FuncionarioMapper {

    // A senha recebida já deve vir criptografada (o service faz isso)
    public static Funcionario toEntity(FuncionarioRequest request, String senhaCriptografada) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(request.nome().trim());
        funcionario.setUsuario(request.usuario().trim());
        funcionario.setSenha(senhaCriptografada);
        funcionario.setPerfil(request.perfil());
        return funcionario;
    }

    public static FuncionarioResponse toDTO(Funcionario funcionario) {
        return new FuncionarioResponse(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getUsuario(),
                funcionario.getPerfil());
    }

    public static LoginResponse toLoginDTO(Funcionario funcionario) {
        return new LoginResponse(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getPerfil());
    }
}
