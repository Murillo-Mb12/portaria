package com.portaria.services;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AcessoService.class);

    // Limites usados quando a consulta vem sem "de" ou sem "ate"
    private static final LocalDateTime INICIO_DOS_TEMPOS = LocalDate.of(1900, 1, 1).atStartOfDay();
    private static final LocalDateTime FIM_DOS_TEMPOS = LocalDate.of(3000, 1, 1).atStartOfDay();

    // Uma saída registrada por engano só pode ser desfeita logo em seguida
    static final int MINUTOS_PARA_DESFAZER_SAIDA = 10;

    @Autowired
    private AcessoRepository repository;

    @Autowired
    private VisitanteService visitanteService;

    @Autowired
    private MoradorService moradorService;

    @Autowired
    private VeiculoService veiculoService;

    // RF10/RF11 - Consulta e relatório (todos os filtros são opcionais).
    // O período é filtrado no banco; a busca por texto ignora acentos e maiúsculas ("jose" acha "José").
    @Transactional(readOnly = true)
    public List<AcessoResponse> getAcessos(String busca, LocalDate de, LocalDate ate) {
        if (de != null && ate != null && de.isAfter(ate)) {
            throw new BadRequestException("A data inicial não pode ser maior que a final.");
        }
        LocalDateTime inicio = de == null ? INICIO_DOS_TEMPOS : de.atStartOfDay();
        LocalDateTime fim = ate == null ? FIM_DOS_TEMPOS : ate.plusDays(1).atStartOfDay();
        String termo = normalizar(busca);

        return repository.findByPeriodo(inicio, fim)
                .stream()
                .map(AcessoMapper::toDTO)
                .filter(a -> termo.isEmpty()
                        || normalizar(juntar(a.nome(), a.detalhe(), a.veiculo(), a.entradaPor(), a.saidaPor())).contains(termo))
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
    public AcessoResponse registrarEntrada(EntradaRequest request, String funcionario) {
        Acesso acesso = new Acesso();
        acesso.setEntradaPor(funcionario);
        acesso.setObjetivo(request.objetivo());
        acesso.setEntrada(agora());

        switch (request.objetivo()) {
            case VISITA -> preencherVisita(acesso, request);
            case DOACAO -> {
                acesso.setNome(textoObrigatorio(request.nome(), "Informe quem está trazendo a doação."));
                acesso.setDocumento(documentoForaDoLar(request.documento()));
                acesso.setDescricao(textoObrigatorio(request.descricao(), "Descreva os itens doados."));
            }
            case OUTROS -> {
                acesso.setNome(textoObrigatorio(request.nome(), "Informe o nome da pessoa."));
                acesso.setDocumento(documentoForaDoLar(request.documento()));
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
    public AcessoResponse registrarSaida(long id, String funcionario) {
        Acesso acesso = findEntity(id);
        if (acesso.getSaida() != null) {
            throw new BusinessException("A saída deste acesso já foi registrada.");
        }
        acesso.setSaida(agora());
        acesso.setSaidaPor(funcionario);
        return AcessoMapper.toDTO(repository.save(acesso));
    }

    /**
     * Desfaz uma saída registrada por engano (clique na linha errada): a pessoa volta para a lista de presentes.
     * Só vale nos primeiros minutos, para o histórico antigo não ser alterado.
     */
    public AcessoResponse desfazerSaida(long id, String funcionario) {
        Acesso acesso = findEntity(id);
        if (acesso.getSaida() == null) {
            throw new BusinessException("Este acesso ainda não tem saída registrada.");
        }
        if (acesso.getSaida().isBefore(agora().minusMinutes(MINUTOS_PARA_DESFAZER_SAIDA))) {
            throw new BusinessException("A saída só pode ser desfeita até " + MINUTOS_PARA_DESFAZER_SAIDA
                    + " minutos depois de registrada.");
        }
        // Se a pessoa ou o veículo já entrou de novo, desfazer criaria duas entradas abertas
        if (acesso.getVisitante() != null
                && repository.existsByVisitanteIdAndSaidaIsNull(acesso.getVisitante().getId())) {
            throw new BusinessException(acesso.getVisitante().getNome() + " já está no Lar em outra entrada.");
        }
        if (acesso.getVeiculo() != null && repository.existsByVeiculoIdAndSaidaIsNull(acesso.getVeiculo().getId())) {
            throw new BusinessException("O veículo " + acesso.getVeiculo().getPlaca() + " já está no Lar em outra entrada.");
        }
        if (acesso.getDocumento() != null && repository.existsByDocumentoAndSaidaIsNull(acesso.getDocumento())) {
            throw new BusinessException("A pessoa com o CPF " + acesso.getDocumento() + " já está no Lar em outra entrada.");
        }
        log.info("Saída desfeita: acesso {} ({}) por {}", acesso.getId(), acesso.getSaidaPor(), funcionario);
        acesso.setSaida(null);
        acesso.setSaidaPor(null);
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

    private Acesso findEntity(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de acesso não encontrado"));
    }

    /** CPF de doação/outros é opcional; se informado, a mesma pessoa não pode entrar duas vezes. */
    private String documentoForaDoLar(String documento) {
        String cpf = texto(documento);
        if (cpf != null && repository.existsByDocumentoAndSaidaIsNull(cpf)) {
            throw new BusinessException("A pessoa com o CPF " + cpf + " já está no Lar.");
        }
        return cpf;
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

    /** Junta os textos ignorando os vazios (evita que "null" entre na busca) */
    private static String juntar(String... partes) {
        StringBuilder sb = new StringBuilder();
        for (String p : partes) {
            if (p != null) sb.append(p).append(' ');
        }
        return sb.toString();
    }

    /** "José Carlos " -> "jose carlos" (sem acentos, minúsculo, sem espaços nas pontas) */
    private static String normalizar(String valor) {
        if (valor == null) return "";
        return Normalizer.normalize(valor, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim();
    }

    private LocalDateTime agora() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}
