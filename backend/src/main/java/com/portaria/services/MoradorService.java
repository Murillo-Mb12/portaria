package com.portaria.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.MoradorRequest;
import com.portaria.dtos.MoradorResponse;
import com.portaria.entities.Morador;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.mappers.MoradorMapper;
import com.portaria.repositories.AcessoRepository;
import com.portaria.repositories.MoradorRepository;
import com.portaria.repositories.VisitanteRepository;

@Service
@Transactional
public class MoradorService {

    @Autowired
    private MoradorRepository repository;

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private AcessoRepository acessoRepository;

    @Transactional(readOnly = true)
    public List<MoradorResponse> getMoradores() {
        return repository.findAll()
                .stream()
                .map(MoradorMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public MoradorResponse getMoradorById(long id) {
        return MoradorMapper.toDTO(findEntity(id));
    }

    public MoradorResponse save(MoradorRequest request) {
        Morador morador = repository.save(MoradorMapper.toEntity(request));
        return MoradorMapper.toDTO(morador);
    }

    public void update(long id, MoradorRequest request) {
        Morador aux = findEntity(id);
        aux.setNome(request.nome().trim());
        aux.setUnidade(request.unidade().trim());
        aux.setTelefone(request.telefone().trim());
        repository.save(aux);
    }

    public void delete(long id) {
        findEntity(id);
        if (visitanteRepository.existsByMoradoresId(id)) {
            throw new BusinessException("Não é possível excluir: há visitantes vinculados a este morador.");
        }
        if (acessoRepository.existsByMoradorId(id)) {
            throw new BusinessException("Não é possível excluir: este morador já recebeu visitas registradas.");
        }
        repository.deleteById(id);
    }

    // Usado também pelo VisitanteService e pelo AcessoService
    Morador findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Morador não encontrado"));
    }
}
