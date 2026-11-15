package com.portaria.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Funcionario;
import com.portaria.entities.enums.Perfil;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    List<Funcionario> findAllByOrderByNomeAsc();

    Optional<Funcionario> findByUsuario(String usuario);

    boolean existsByUsuario(String usuario);

    boolean existsByUsuarioAndIdNot(String usuario, Long id);

    // Quantos funcionários têm este perfil (para nunca ficar sem administrador)
    long countByPerfil(Perfil perfil);
}
