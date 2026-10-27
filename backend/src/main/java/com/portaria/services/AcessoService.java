package com.portaria.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portaria.dtos.AcessoResponse;
import com.portaria.dtos.EntradaRequest;
import com.portaria.entities.Acesso;
import com.portaria.entities.Morador;
import com.portaria.entities.Veiculo;
import com.portaria.entities.Visitante;
import com.portaria.exceptions.BadRequestException;
import com.portaria.exceptions.BusinessException;
import com.portaria.exceptions.ResourceNotFoundException;
import com.portaria.mappers.AcessoMapper;
import com.portaria.mappers.VeiculoMapper;
import com.portaria.repositories.AcessoRepository;

@Service
@Transactional
public class AcessoService {

    @Autowired
    private AcessoRepository repository;

    @Autowired
    private VisitanteService visitanteService;

    @Autowired
    private MoradorService moradorService;

    @Autowired
    private VeiculoService veiculoService;

    // RF10/RF11 - Consulta e relatório (todos os filtros são opcionais)
    @Transactional(readOnly = true)
    public List<AcessoResponse> getAcessos(String busca, LocalDate de, LocalDate ate) {
        String termo = busca == null ? "" : busca.trim().toLowerCase();

        return repository.findAllByOrderByEntradaDesc()
                .stream()
                .map(AcessoMapper::toDTO)
                .filter(a -> termo.isEmpty()
                        || (a.nome() + " " + a.detalhe() + " " + a.veiculo()).toLowerCase().contains(termo))
                .filter(a -> de == null || !a.entrada().toLocalDate().isBefore(de))
                .filter(a -> ate == null || !a.entrada().toLocalDate().isAfter(ate))
                .toList();
    }

    // Quem está dentro do Lar agora
    @Transactional(readOnly = true)
    public List<AcessoResponse> getPresentes() {
        return repository.findBySaidaIsNullOrderByEntradaDesc()
                .stream()
                .map(AcessoMapper::toDTO)
                .toList();
    }

    // RF06/RF08 - Entrada de uma pessoa (com ou sem veículo), com o objetivo da ida ao Lar
    public AcessoResponse registrarEntrada(EntradaRequest request) {
        Acesso acesso = new Acesso();
        acesso.setObjetivo(request.objetivo());
        acesso.setEntrada(agora());

        switch (request.objetivo()) {
            case VISITA -> preencherVisita(acesso, request);
            case DOACAO -> {
                acesso.setNome(textoObrigatorio(request.nome(), "Informe quem está trazendo a doação."));
                acesso.setDocumento(texto(request.documento()));
                acesso.setDescricao(textoObrigatorio(request.descricao(), "Descreva os itens doados."));
            }
            case OUTROS -> {
                acesso.setNome(textoObrigatorio(request.nome(), "Informe o nome da pessoa."));
                acesso.setDocumento(texto(request.documento()));
                if (request.finalidade() == null) {
                    throw new BadRequestException("Selecione a finalidade (bazar, igreja, reunião...).");
                }
                acesso.setFinalidade(request.finalidade());
                acesso.setDescricao(texto(request.descricao()));
            }
        }

        // Veículo é opcional
        if (request.veiculoId() != null) {
            Veiculo veiculo = veiculoService.findEntity(request.veiculoId());
            if (repository.existsByVeiculoIdAndSaidaIsNull(veiculo.getId())) {
                throw new BusinessException("O veículo " + veiculo.getPlaca() + " já está no Lar.");
            }
            // Na visita, o carro precisa ser de uma das pessoas vinculadas a ele
            if (acesso.getVisitante() != null && veiculo.getPessoas().stream()
                    .noneMatch(p -> p.getId().equals(acesso.getVisitante().getId()))) {
                throw new BusinessException(acesso.getVisitante().getNome() + " não está vinculado(a) ao veículo "
                        + VeiculoMapper.descricaoCurta(veiculo) + ".");
            }
            acesso.setVeiculo(veiculo);
        }

        return AcessoMapper.toDTO(repository.save(acesso));
    }

    // RF07/RF09 - Saída
    public AcessoResponse registrarSaida(long id) {
        Acesso acesso = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de acesso não encontrado"));
        if (acesso.getSaida() != null) {
            throw new BusinessException("A saída deste acesso já foi registrada.");
        }
        acesso.setSaida(agora());
        return AcessoMapper.toDTO(repository.save(acesso));
    }

    /** Visita: o morador escolhido PRECISA estar vinculado ao visitante. */
    private void preencherVisita(Acesso acesso, EntradaRequest request) {
        Visitante visitante = visitanteService.findEntity(obrigatorio(request.visitanteId(), "Selecione o visitante."));
        Morador morador = moradorService.findEntity(obrigatorio(request.moradorId(), "Selecione o morador visitado."));

        if (visitante.getMoradores().stream().noneMatch(m -> m.getId().equals(morador.getId()))) {
            throw new BusinessException(visitante.getNome() + " não é visitante de " + morador.getNome() + ".");
        }
        if (repository.existsByVisitanteIdAndSaidaIsNull(visitante.getId())) {
            throw new BusinessException(visitante.getNome() + " já está no Lar.");
        }
        acesso.setVisitante(visitante);
        acesso.setMorador(morador);
    }

    private static Long obrigatorio(Long id, String mensagem) {
        if (id == null) throw new BadRequestException(mensagem);
        return id;
    }

    private static String textoObrigatorio(String valor, String mensagem) {
        String t = texto(valor);
        if (t == null) throw new BadRequestException(mensagem);
        return t;
    }

    private static String texto(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private LocalDateTime agora() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}
