package com.portaria.controllers;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.portaria.dtos.AcessoResponse;
import com.portaria.dtos.EntradaRequest;
import com.portaria.services.AcessoService;

@RestController
@RequestMapping("/api/acessos")
public class AcessoController {

    @Autowired
    private AcessoService service;

    // GET /api/acessos?busca=maria&de=2026-10-01&ate=2026-10-31
    @GetMapping
    public ResponseEntity<List<AcessoResponse>> getAll(
            @RequestParam(name = "busca", required = false) String busca,
            @RequestParam(name = "de", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
            @RequestParam(name = "ate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
        return ResponseEntity.ok(service.getAcessos(busca, de, ate));
    }

    @GetMapping("presentes")
    public ResponseEntity<List<AcessoResponse>> getPresentes() {
        return ResponseEntity.ok(service.getPresentes());
    }

    @PostMapping("entrada")
    public ResponseEntity<AcessoResponse> registrarEntrada(@Validated @RequestBody EntradaRequest request) {
        AcessoResponse acesso = service.registrarEntrada(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/acessos/{id}")
                .buildAndExpand(acesso.id())
                .toUri();
        return ResponseEntity.created(location).body(acesso);
    }

    @PutMapping("{id}/saida")
    public ResponseEntity<AcessoResponse> registrarSaida(@PathVariable("id") long id) {
        return ResponseEntity.ok(service.registrarSaida(id));
    }
}
