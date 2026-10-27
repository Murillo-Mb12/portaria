package com.portaria.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Formato padrão de erro devolvido pela API.
 * "campos" só vem preenchido em erros de validação (campo -> mensagem).
 */
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        Map<String, String> campos) {

    public ErrorResponse(int status, String erro) {
        this(LocalDateTime.now(), status, erro, Map.of());
    }

    public ErrorResponse(int status, String erro, Map<String, String> campos) {
        this(LocalDateTime.now(), status, erro, campos);
    }
}
