package com.portaria.dtos;

/** Expressões regulares reutilizadas nas validações dos DTOs (iguais às do front-end). */
public final class ValidationPatterns {

    // 000.000.000-00
    public static final String CPF = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$";

    // (15) 3221-4410 ou (15) 99812-3344
    public static final String TELEFONE = "^\\(\\d{2}\\) \\d{4,5}-\\d{4}$";

    // Placa antiga (ABC1234 / ABC-1234) ou Mercosul (ABC1D23)
    public static final String PLACA = "^[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}$";

    private ValidationPatterns() {
    }
}
