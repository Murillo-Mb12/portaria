package com.portaria.exceptions;

/** Dado obrigatório ausente ou combinação inválida de campos -> HTTP 400 */
public class BadRequestException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BadRequestException(String message) {
        super(message);
    }
}
