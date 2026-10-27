package com.portaria.services;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.VeiculoRequest;
import com.portaria.dtos.VeiculoResponse;
import com.portaria.entities.Veiculo;
import com.portaria.entities.Visitante;
import com.portaria.entities.enums.TipoVeiculo;
import com.portaria.exceptions.BadRequestException;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.mappers.VeiculoMapper;
import com.portaria.repositories.AcessoRepository;
import com.portaria.repositories.VeiculoRepository;

@Service
@Transactional
public class VeiculoService {

    @Autowired
    private VeiculoRepository repository;

    @Autowired
    private AcessoRepository acessoRepository;

    @Autowired
    private VisitanteService visitanteService;

    @Transactional(readOnly = true)
    public List<VeiculoResponse> getVeiculos() {
        return repository.findAll()
                .stream()
                .map(VeiculoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public VeiculoResponse getVeiculoById(long id) {
        return VeiculoMapper.toDTO(findEntity(id));
    }

    public VeiculoResponse save(VeiculoRequest request) {
        String placa = VeiculoMapper.normalizarPlaca(request.placa());
        if (repository.existsByPlaca(placa)) {
            throw new BusinessException("Já existe um veículo com a placa " + placa);
        }
        Veiculo veiculo = new Veiculo();
        preencher(veiculo, request, placa);
        return VeiculoMapper.toDTO(repository.save(veiculo));
    }

    public void update(long id, VeiculoRequest request) {
        Veiculo aux = findEntity(id);
        String placa = VeiculoMapper.normalizarPlaca(request.placa());
        if (repository.existsByPlacaAndIdNot(placa, id)) {
            throw new BusinessException("Já existe um veículo com a placa " + placa);
        }
        preencher(aux, request, placa);
        repository.save(aux);
    }

    public void delete(long id) {
        findEntity(id);
        if (acessoRepository.existsByVeiculoId(id)) {
            throw new BusinessException("Não é possível excluir: este veículo já possui acessos registrados.");
        }
        repository.deleteById(id);
    }

    Veiculo findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
    }

    /**
     * Regra do tipo:
     *  VISITANTE          -> precisa de uma ou mais pessoas vinculadas (ex.: família)
     *  INSTITUICAO/OUTRO  -> precisa do nome do responsável
     */
    private void preencher(Veiculo veiculo, VeiculoRequest request, String placa) {
        veiculo.setPlaca(placa);
        veiculo.setMarca(request.marca().trim());
        veiculo.setModelo(request.modelo().trim());
        veiculo.setCor(request.cor().trim());
        veiculo.setTipo(request.tipo());
        veiculo.getPessoas().clear();

        if (request.tipo() == TipoVeiculo.VISITANTE) {
            if (request.pessoaIds() == null || request.pessoaIds().isEmpty()) {
                throw new BadRequestException("Vincule pelo menos uma pessoa ao veículo.");
            }
            Set<Visitante> pessoas = new LinkedHashSet<>();
            for (Long pessoaId : request.pessoaIds()) {
                pessoas.add(visitanteService.findEntity(pessoaId));
            }
            veiculo.getPessoas().addAll(pessoas);
            veiculo.setResponsavel(null);
        } else {
            if (request.responsavel() == null || request.responsavel().isBlank()) {
                throw new BadRequestException("Informe o responsável pelo veículo.");
            }
            veiculo.setResponsavel(request.responsavel().trim());
        }
    }
}
