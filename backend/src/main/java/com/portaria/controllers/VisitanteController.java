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

import com.portaria.dtos.VisitanteRequest;
import com.portaria.dtos.VisitanteResponse;
import com.portaria.services.VisitanteService;

@RestController
@RequestMapping("/api/visitantes")
public class VisitanteController {

    @Autowired
    private VisitanteService service;

    @GetMapping
    public ResponseEntity<List<VisitanteResponse>> getAll() {
        return ResponseEntity.ok(service.getVisitantes());
    }

    @GetMapping("{id}")
    public ResponseEntity<VisitanteResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(service.getVisitanteById(id));
    }

    @PostMapping
    public ResponseEntity<VisitanteResponse> save(@Validated @RequestBody VisitanteRequest request) {
        VisitanteResponse visitante = service.save(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(visitante.id())
                .toUri();
        return ResponseEntity.created(location).body(visitante);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") long id, @Validated @RequestBody VisitanteRequest request) {
        service.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
