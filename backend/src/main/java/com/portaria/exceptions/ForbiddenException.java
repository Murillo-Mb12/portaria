package com.portaria.exceptions;

/** Logado, mas sem permissão para esta ação -> HTTP 403 */
public class ForbiddenException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ForbiddenException(String message) {
        super(message);
    }
}
