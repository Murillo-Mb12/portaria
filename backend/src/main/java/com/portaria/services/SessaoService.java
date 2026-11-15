package com.portaria.services;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.portaria.entities.enums.Perfil;

/**
 * Sessões de quem fez login. No login o funcionário recebe um token aleatório,
 * que o front-end manda em toda chamada ("Authorization: Bearer ...").
 *
 * As sessões ficam na memória do servidor: se o servidor reiniciar, todos entram de novo.
 * A sessão vale 12 horas (um plantão) contadas a partir do login, SEM renovar com o uso:
 * a tela de Entrada e saída se atualiza sozinha a cada 30 s, e se renovasse, quem esquecesse
 * de clicar em "Sair" ficaria logado para sempre no computador compartilhado da portaria.
 */
@Service
public class SessaoService {

    static final Duration VALIDADE = Duration.ofHours(12);

    public record Sessao(Long funcionarioId, String nome, Perfil perfil, Instant expiraEm) {
        boolean expirada(Instant agora) {
            return agora.isAfter(expiraEm);
        }
    }

    private final SecureRandom aleatorio = new SecureRandom();
    private final Map<String, Sessao> sessoes = new ConcurrentHashMap<>();

    public String abrir(Long funcionarioId, String nome, Perfil perfil) {
        limparExpiradas();
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessoes.put(token, new Sessao(funcionarioId, nome, perfil, Instant.now().plus(VALIDADE)));
        return token;
    }

    /** Devolve a sessão do token, ou vazio se não existir ou tiver expirado. */
    public Optional<Sessao> validar(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        Instant agora = Instant.now();
        Sessao sessao = sessoes.get(token);
        if (sessao == null) return Optional.empty();
        if (sessao.expirada(agora)) {
            sessoes.remove(token);
            return Optional.empty();
        }
        return Optional.of(sessao);
    }

    public void encerrar(String token) {
        if (token != null) sessoes.remove(token);
    }

    /** Ao excluir um funcionário ou mudar o perfil/senha dele, as sessões abertas dele deixam de valer. */
    public void encerrarSessoesDe(Long funcionarioId) {
        sessoes.values().removeIf(s -> s.funcionarioId().equals(funcionarioId));
    }

    private void limparExpiradas() {
        Instant agora = Instant.now();
        sessoes.values().removeIf(s -> s.expirada(agora));
    }
}
