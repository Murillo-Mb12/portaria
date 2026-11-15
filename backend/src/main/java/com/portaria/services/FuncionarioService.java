package com.portaria.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.FuncionarioRequest;
import com.portaria.dtos.FuncionarioResponse;
import com.portaria.dtos.LoginRequest;
import com.portaria.dtos.LoginResponse;
import com.portaria.entities.Funcionario;
import com.portaria.entities.enums.Perfil;
import com.portaria.exceptions.BadRequestException;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.exceptions.UnauthorizedException;
import com.portaria.mappers.FuncionarioMapper;
import com.portaria.repositories.FuncionarioRepository;

@Service
@Transactional
public class FuncionarioService {

    /** Registro dos eventos de segurança (logins, senhas erradas, bloqueios). Nunca registra senhas. */
    private static final Logger seguranca = LoggerFactory.getLogger("SEGURANCA");

    @Autowired
    private FuncionarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private TentativasLoginService tentativas;

    /** Hash de uma senha qualquer: usado quando o usuário não existe, para a resposta demorar o mesmo tanto. */
    private String hashFalso;

    /**
     * RF01 - Login: compara a senha digitada com o hash BCrypt salvo no banco.
     * Senhas erradas seguidas bloqueiam o usuário/aparelho por um tempo (TentativasLoginService).
     * A mensagem de erro é a mesma para usuário inexistente e senha errada, e o tempo de resposta também,
     * para ninguém descobrir quais usuários existem.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request, String ip) {
        String usuario = request.usuario().trim();
        tentativas.verificar(usuario, ip);

        Funcionario funcionario = repository.findByUsuario(usuario).orElse(null);
        String hash = funcionario != null ? funcionario.getSenha() : hashFalso();
        boolean senhaCerta = passwordEncoder.matches(request.senha(), hash) && funcionario != null;

        if (!senhaCerta) {
            boolean bloqueou = tentativas.registrarFalha(usuario, ip);
            seguranca.warn("Login recusado: usuario='{}' ip={}{}", paraLog(usuario), ip, bloqueou ? " -> BLOQUEADO por 15 min" : "");
            throw new UnauthorizedException("Usuário ou senha inválidos.");
        }
        tentativas.registrarSucesso(usuario, ip);
        seguranca.info("Login: usuario='{}' perfil={} ip={}", paraLog(usuario), funcionario.getPerfil(), ip);
        String token = sessaoService.abrir(funcionario.getId(), funcionario.getNome(), funcionario.getPerfil());
        return FuncionarioMapper.toLoginDTO(funcionario, token);
    }

    /** Tira quebras de linha do que foi digitado, para ninguém forjar linhas falsas no registro. */
    private static String paraLog(String texto) {
        return texto.replaceAll("[\r\n\t]", "_");
    }

    private String hashFalso() {
        if (hashFalso == null) hashFalso = passwordEncoder.encode("senha-que-nao-existe");
        return hashFalso;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResponse> getFuncionarios() {
        return repository.findAllByOrderByNomeAsc()
                .stream()
                .map(FuncionarioMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionarioResponse getFuncionarioById(long id) {
        return FuncionarioMapper.toDTO(findEntity(id));
    }

    public FuncionarioResponse save(FuncionarioRequest request) {
        if (!temSenha(request)) {
            throw new BadRequestException("Informe a senha do novo funcionário.");
        }
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
        if (aux.getPerfil() == Perfil.ADMINISTRADOR && request.perfil() != Perfil.ADMINISTRADOR
                && ultimoAdministrador()) {
            throw new BusinessException("Este é o único administrador. Cadastre outro antes de mudar o perfil dele.");
        }
        boolean mudouPerfil = aux.getPerfil() != request.perfil();
        aux.setNome(request.nome().trim());
        aux.setUsuario(request.usuario().trim());
        // Senha em branco na edição = manter a senha atual
        if (temSenha(request)) {
            aux.setSenha(passwordEncoder.encode(request.senha()));
        }
        aux.setPerfil(request.perfil());
        repository.save(aux);
        // Perfil ou senha mudou: quem estava logado com este usuário precisa entrar de novo
        if (temSenha(request) || mudouPerfil) {
            sessaoService.encerrarSessoesDe(id);
        }
    }

    public void delete(long id) {
        Funcionario funcionario = findEntity(id);
        if (funcionario.getPerfil() == Perfil.ADMINISTRADOR && ultimoAdministrador()) {
            throw new BusinessException("Não é possível excluir o único administrador do sistema.");
        }
        repository.deleteById(id);
        sessaoService.encerrarSessoesDe(id);
    }

    private Funcionario findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));
    }

    // Sem administrador ninguém mais conseguiria cadastrar funcionários
    private boolean ultimoAdministrador() {
        return repository.countByPerfil(Perfil.ADMINISTRADOR) <= 1;
    }

    private static boolean temSenha(FuncionarioRequest request) {
        return request.senha() != null && !request.senha().isBlank();
    }
}
