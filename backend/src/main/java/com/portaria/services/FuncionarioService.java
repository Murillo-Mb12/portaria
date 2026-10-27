package com.portaria.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.FuncionarioRequest;
import com.portaria.dtos.FuncionarioResponse;
import com.portaria.dtos.LoginRequest;
import com.portaria.dtos.LoginResponse;
import com.portaria.entities.Funcionario;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.exceptions.UnauthorizedException;
import com.portaria.mappers.FuncionarioMapper;
import com.portaria.repositories.FuncionarioRepository;

@Service
@Transactional
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // RF01 - Login: compara a senha digitada com o hash BCrypt salvo no banco
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        return repository.findByUsuario(request.usuario().trim())
                .filter(f -> passwordEncoder.matches(request.senha(), f.getSenha()))
                .map(FuncionarioMapper::toLoginDTO)
                .orElseThrow(() -> new UnauthorizedException("Usuário ou senha inválidos."));
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResponse> getFuncionarios() {
        return repository.findAll()
                .stream()
                .map(FuncionarioMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionarioResponse getFuncionarioById(long id) {
        return FuncionarioMapper.toDTO(findEntity(id));
    }

    public FuncionarioResponse save(FuncionarioRequest request) {
        if (repository.existsByUsuario(request.usuario().trim())) {
            throw new BusinessException("O usuário '" + request.usuario().trim() + "' já está em uso.");
        }
        Funcionario funcionario = FuncionarioMapper.toEntity(request, passwordEncoder.encode(request.senha()));
        return FuncionarioMapper.toDTO(repository.save(funcionario));
    }

    public void update(long id, FuncionarioRequest request) {
        Funcionario aux = findEntity(id);
        if (repository.existsByUsuarioAndIdNot(request.usuario().trim(), id)) {
            throw new BusinessException("O usuário '" + request.usuario().trim() + "' já está em uso.");
        }
        aux.setNome(request.nome().trim());
        aux.setUsuario(request.usuario().trim());
        aux.setSenha(passwordEncoder.encode(request.senha()));
        aux.setPerfil(request.perfil());
        repository.save(aux);
    }

    public void delete(long id) {
        findEntity(id);
        repository.deleteById(id);
    }

    private Funcionario findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));
    }
}
