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

import com.portaria.dtos.MoradorRequest;
import com.portaria.dtos.MoradorResponse;
import com.portaria.services.MoradorService;

@RestController
@RequestMapping("/api/moradores")
public class MoradorController {

    @Autowired
    private MoradorService service;

    @GetMapping
    public ResponseEntity<List<MoradorResponse>> getAll() {
        return ResponseEntity.ok(service.getMoradores());
    }

    @GetMapping("{id}")
    public ResponseEntity<MoradorResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(service.getMoradorById(id));
    }

    @PostMapping
    public ResponseEntity<MoradorResponse> save(@Validated @RequestBody MoradorRequest request) {
        MoradorResponse morador = service.save(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(morador.id())
                .toUri();
        return ResponseEntity.created(location).body(morador);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") long id, @Validated @RequestBody MoradorRequest request) {
        service.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
