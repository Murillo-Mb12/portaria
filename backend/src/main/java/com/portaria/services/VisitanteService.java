package com.portaria.services;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.VisitanteRequest;
import com.portaria.dtos.VisitanteResponse;
import com.portaria.entities.Morador;
import com.portaria.entities.Visitante;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.mappers.VisitanteMapper;
import com.portaria.repositories.AcessoRepository;
import com.portaria.repositories.VeiculoRepository;
import com.portaria.repositories.VisitanteRepository;

@Service
@Transactional
public class VisitanteService {

    @Autowired
    private VisitanteRepository repository;

    @Autowired
    private MoradorService moradorService;

    @Autowired
    private AcessoRepository acessoRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Transactional(readOnly = true)
    public List<VisitanteResponse> getVisitantes() {
        return repository.findAll()
                .stream()
                .map(VisitanteMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public VisitanteResponse getVisitanteById(long id) {
        return VisitanteMapper.toDTO(findEntity(id));
    }

    public VisitanteResponse save(VisitanteRequest request) {
        if (repository.existsByDocumento(request.documento().trim())) {
            throw new BusinessException("Já existe um visitante com o documento " + request.documento().trim());
        }
        Visitante visitante = VisitanteMapper.toEntity(request, buscarMoradores(request.moradorIds()));
        return VisitanteMapper.toDTO(repository.save(visitante));
    }

    public void update(long id, VisitanteRequest request) {
        Visitante aux = findEntity(id);
        if (repository.existsByDocumentoAndIdNot(request.documento().trim(), id)) {
            throw new BusinessException("Já existe um visitante com o documento " + request.documento().trim());
        }
        aux.setNome(request.nome().trim());
        aux.setDocumento(request.documento().trim());
        aux.setTelefone(request.telefone().trim());
        aux.setVinculo(request.vinculo());
        aux.getMoradores().clear();
        aux.getMoradores().addAll(buscarMoradores(request.moradorIds()));
        repository.save(aux);
    }

    public void delete(long id) {
        findEntity(id);
        if (acessoRepository.existsByVisitanteId(id)) {
            throw new BusinessException("Não é possível excluir: este visitante já possui acessos registrados.");
        }
        if (veiculoRepository.existsByPessoasId(id)) {
            throw new BusinessException("Não é possível excluir: o visitante está vinculado a um veículo. Remova-o do veículo primeiro.");
        }
        repository.deleteById(id);
    }

    Visitante findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitante não encontrado"));
    }

    private Set<Morador> buscarMoradores(List<Long> ids) {
        Set<Morador> moradores = new LinkedHashSet<>();
        for (Long moradorId : ids) {
            moradores.add(moradorService.findEntity(moradorId));
        }
        return moradores;
    }
}
