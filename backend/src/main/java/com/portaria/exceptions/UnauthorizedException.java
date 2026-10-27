package com.portaria.exceptions;

/** Usuário ou senha inválidos -> HTTP 401 */
public class UnauthorizedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UnauthorizedException(String message) {
        super(message);
    }
}
