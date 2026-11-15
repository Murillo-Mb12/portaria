package com.portaria.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portaria.entities.Morador;

public interface MoradorRepository extends JpaRepository<Morador, Long> {

    List<Morador> findAllByOrderByNomeAsc();

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, Long id);
}
