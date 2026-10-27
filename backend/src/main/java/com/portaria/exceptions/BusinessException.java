package com.portaria.exceptions;

/** Violação de regra de negócio (ex.: placa duplicada) -> HTTP 409 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BusinessException(String message) {
        super(message);
    }
}
