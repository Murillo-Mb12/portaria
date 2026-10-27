package com.portaria.dtos;

import java.time.LocalDateTime;

import com.portaria.entities.enums.ObjetivoAcesso;

/**
 * nome    -> pessoa que entrou (visitante, doador...)
 * detalhe -> "Visita a ..." / itens doados / finalidade
 * veiculo -> "placa - marca modelo (cor)" ou null se chegou a pé
 */
public record AcessoResponse(
        Long id,
        ObjetivoAcesso objetivo,
        String nome,
        String detalhe,
        String veiculo,
        LocalDateTime entrada,
        LocalDateTime saida) {
}
