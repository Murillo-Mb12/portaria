package com.portaria.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.portaria.dtos.VeiculoRequest;
import com.portaria.dtos.VeiculoResponse;
import com.portaria.services.VeiculoService;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoService service;

    @GetMapping
    public ResponseEntity<List<VeiculoResponse>> getAll() {
        return ResponseEntity.ok(service.getVeiculos());
    }

    @GetMapping("{id}")
    public ResponseEntity<VeiculoResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(service.getVeiculoById(id));
    }

    @PostMapping
    public ResponseEntity<VeiculoResponse> save(@Validated @RequestBody VeiculoRequest request) {
        VeiculoResponse veiculo = service.save(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(veiculo.id())
                .toUri();
        return ResponseEntity.created(location).body(veiculo);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") long id, @Validated @RequestBody VeiculoRequest request) {
        service.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
