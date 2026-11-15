package com.portaria.services;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.portaria.exceptions.TooManyRequestsException;

/**
 * Proteção contra "força bruta" (alguém testando muitas senhas):
 *  - 5 senhas erradas para o mesmo usuário vindas do mesmo aparelho -> bloqueia por 15 minutos;
 *  - 20 senhas erradas vindas do mesmo aparelho (qualquer usuário) -> bloqueia o aparelho por 15 minutos.
 * Um login certo zera a contagem daquele usuário. Os contadores ficam na memória do servidor.
 */
@Service
public class TentativasLoginService {

    static final int MAX_POR_USUARIO = 5;
    static final int MAX_POR_APARELHO = 20;
    static final Duration JANELA = Duration.ofMinutes(15);

    private record Contagem(int falhas, Instant inicio, Instant bloqueadoAte) {
    }

    private final Map<String, Contagem> contagens = new ConcurrentHashMap<>();

    /** Lança 429 se este usuário ou este aparelho estiver bloqueado no momento. */
    public void verificar(String usuario, String ip) {
        Instant agora = Instant.now();
        verificarChave(chaveUsuario(usuario, ip), agora);
        verificarChave(chaveAparelho(ip), agora);
    }

    /** Conta uma senha errada. Devolve true se essa falha causou um bloqueio. */
    public boolean registrarFalha(String usuario, String ip) {
        Instant agora = Instant.now();
        boolean bloqueouUsuario = somar(chaveUsuario(usuario, ip), MAX_POR_USUARIO, agora);
        boolean bloqueouAparelho = somar(chaveAparelho(ip), MAX_POR_APARELHO, agora);
        return bloqueouUsuario || bloqueouAparelho;
    }

    public void registrarSucesso(String usuario, String ip) {
        contagens.remove(chaveUsuario(usuario, ip));
    }

    private void verificarChave(String chave, Instant agora) {
        Contagem c = contagens.get(chave);
        if (c != null && c.bloqueadoAte() != null && agora.isBefore(c.bloqueadoAte())) {
            long minutos = Math.max(1, Duration.between(agora, c.bloqueadoAte()).toSeconds() / 60 + 1);
            throw new TooManyRequestsException("Muitas tentativas de senha erradas. Aguarde " + minutos
                    + (minutos == 1 ? " minuto" : " minutos") + " e tente de novo.");
        }
    }

    private boolean somar(String chave, int limite, Instant agora) {
        limparAntigas(agora);
        Contagem nova = contagens.compute(chave, (k, c) -> {
            if (c == null || agora.isAfter(c.inicio().plus(JANELA))) {
                c = new Contagem(0, agora, null);
            }
            int falhas = c.falhas() + 1;
            Instant bloqueio = falhas >= limite ? agora.plus(JANELA) : c.bloqueadoAte();
            return new Contagem(falhas, c.inicio(), bloqueio);
        });
        return nova.falhas() == limite;
    }

    private void limparAntigas(Instant agora) {
        if (contagens.size() < 1000) return;
        contagens.entrySet().removeIf(e -> {
            Contagem c = e.getValue();
            Instant fim = c.bloqueadoAte() != null ? c.bloqueadoAte() : c.inicio().plus(JANELA);
            return agora.isAfter(fim);
        });
    }

    private static String chaveUsuario(String usuario, String ip) {
        return "u:" + (usuario == null ? "" : usuario.trim().toLowerCase()) + "|" + ip;
    }

    private static String chaveAparelho(String ip) {
        return "ip:" + ip;
    }
}
