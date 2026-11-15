package com.portaria.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portaria.dtos.LoginRequest;
import com.portaria.dtos.LoginResponse;
import com.portaria.config.AutenticacaoInterceptor;
import com.portaria.services.FuncionarioService;
import com.portaria.services.SessaoService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private FuncionarioService service;

    @Autowired
    private SessaoService sessaoService;

    // RF01 - Login
    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@Validated @RequestBody LoginRequest request, HttpServletRequest http) {
        return ResponseEntity.ok(service.login(request, ipDe(http)));
    }

    // Sair: o token deixa de valer na hora
    @PostMapping("logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        sessaoService.encerrar(AutenticacaoInterceptor.token(request));
        return ResponseEntity.noContent().build();
    }

    /**
     * Endereço de quem chamou. No Docker a chamada passa pelo nginx, que informa o endereço
     * verdadeiro no cabeçalho X-Real-IP (a porta 8080 não fica aberta para a rede).
     */
    static String ipDe(HttpServletRequest http) {
        String real = http.getHeader("X-Real-IP");
        return real != null && !real.isBlank() ? real.trim() : http.getRemoteAddr();
    }
}
