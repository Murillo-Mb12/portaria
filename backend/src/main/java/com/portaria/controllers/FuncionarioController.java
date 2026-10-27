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

import com.portaria.dtos.FuncionarioRequest;
import com.portaria.dtos.FuncionarioResponse;
import com.portaria.services.FuncionarioService;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService service;

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> getAll() {
        return ResponseEntity.ok(service.getFuncionarios());
    }

    @GetMapping("{id}")
    public ResponseEntity<FuncionarioResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(service.getFuncionarioById(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> save(@Validated @RequestBody FuncionarioRequest request) {
        FuncionarioResponse funcionario = service.save(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(funcionario.id())
                .toUri();
        return ResponseEntity.created(location).body(funcionario);
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable("id") long id, @Validated @RequestBody FuncionarioRequest request) {
        service.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
