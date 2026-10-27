package com.portaria.exceptions;

/** Lançada quando um registro não existe -> HTTP 404 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
