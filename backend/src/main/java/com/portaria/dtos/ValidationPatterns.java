package com.portaria.dtos;

/** Expressões regulares reutilizadas nas validações dos DTOs. */
public final class ValidationPatterns {

    // Aceita (11) 91234-5678, 11912345678, +55 11 91234-5678 etc.
    public static final String TELEFONE = "^[0-9()+\\s-]{8,20}$";

    // Placa antiga (ABC1234) ou Mercosul (ABC1D23); o hífen é opcional
    public static final String PLACA = "^[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}$";

    private ValidationPatterns() {
    }
}
