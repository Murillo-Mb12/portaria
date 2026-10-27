package com.portaria.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByUsuario(String usuario);

    boolean existsByUsuario(String usuario);

    boolean existsByUsuarioAndIdNot(String usuario, Long id);
}
