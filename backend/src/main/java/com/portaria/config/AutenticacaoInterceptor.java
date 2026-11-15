package com.portaria.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.portaria.entities.enums.Perfil;
import com.portaria.exceptions.ForbiddenException;
import com.portaria.exceptions.UnauthorizedException;
import com.portaria.services.SessaoService;
import com.portaria.services.SessaoService.Sessao;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Toda chamada à API (menos o login) precisa do token recebido no login.
 * A tela de funcionários (/api/funcionarios) é só para administrador.
 */
@Component
public class AutenticacaoInterceptor implements HandlerInterceptor {

    /** Atributo da requisição com a sessão de quem está chamando. */
    public static final String SESSAO = "portaria.sessao";

    private static final Logger seguranca = LoggerFactory.getLogger("SEGURANCA");

    @Autowired
    private SessaoService sessaoService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // A consulta prévia do navegador (CORS) não leva o token
        if (HttpMethod.OPTIONS.matches(request.getMethod())) return true;

        Sessao sessao = sessaoService.validar(token(request))
                .orElseThrow(() -> new UnauthorizedException("Sua sessão expirou. Entre novamente."));

        if (request.getRequestURI().startsWith("/api/funcionarios") && sessao.perfil() != Perfil.ADMINISTRADOR) {
            seguranca.warn("Acesso negado: '{}' (perfil {}) tentou {} {}", sessao.nome(), sessao.perfil(),
                    request.getMethod(), request.getRequestURI());
            throw new ForbiddenException("Apenas o administrador pode gerenciar funcionários.");
        }
        request.setAttribute(SESSAO, sessao);
        return true;
    }

    /** "Authorization: Bearer abc123" -> "abc123" */
    public static String token(HttpServletRequest request) {
        String cabecalho = request.getHeader("Authorization");
        if (cabecalho == null || !cabecalho.regionMatches(true, 0, "Bearer ", 0, 7)) return null;
        return cabecalho.substring(7).trim();
    }
}
