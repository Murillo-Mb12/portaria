package com.portaria.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portaria.dtos.LoginRequest;
import com.portaria.dtos.LoginResponse;
import com.portaria.services.FuncionarioService;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private FuncionarioService service;

    // RF01 - Login
    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@Validated @RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }
}
