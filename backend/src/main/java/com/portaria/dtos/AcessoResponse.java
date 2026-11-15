package com.portaria.dtos;

import java.time.LocalDateTime;

import com.portaria.entities.enums.ObjetivoAcesso;

/**
 * nome    -> pessoa que entrou (visitante, doador...)
 * detalhe -> "Visita a ..." / itens doados / finalidade
 * unidade -> ala e quarto do morador visitado (só na visita; null nos outros casos)
 * veiculo -> "placa - marca modelo (cor)" ou null se chegou a pé
 * entradaPor / saidaPor -> funcionário que registrou a entrada / a saída (null nos registros antigos)
 */
public record AcessoResponse(
        Long id,
        ObjetivoAcesso objetivo,
        String nome,
        String detalhe,
        String unidade,
        String veiculo,
        LocalDateTime entrada,
        LocalDateTime saida,
        String entradaPor,
        String saidaPor) {
}
