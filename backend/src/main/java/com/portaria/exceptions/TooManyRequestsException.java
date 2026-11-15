package com.portaria.exceptions;

/** Muitas tentativas seguidas (ex.: senha errada várias vezes) -> HTTP 429 */
public class TooManyRequestsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TooManyRequestsException(String message) {
        super(message);
    }
}
