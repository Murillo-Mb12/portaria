package com.portaria.entities;

import java.time.LocalDateTime;

import com.portaria.entities.enums.FinalidadeAcesso;
import com.portaria.entities.enums.ObjetivoAcesso;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Registro de entrada/saída de uma pessoa no Lar.
 *
 * objetivo  VISITA  -> visitante + morador visitado
 *           DOACAO  -> nome de quem trouxe + descrição dos itens
 *           OUTROS  -> nome + finalidade (bazar, igreja, reunião, imprensa...)
 * veiculo   opcional: preenchido quando a pessoa chega com um veículo
 * saida     nula enquanto a pessoa estiver no Lar
 */
@Entity
@Table(name = "TBL_ACESSO")
public class Acesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ObjetivoAcesso objetivo;

    @ManyToOne
    @JoinColumn(name = "VISITANTE_ID")
    private Visitante visitante;

    @ManyToOne
    @JoinColumn(name = "MORADOR_ID")
    private Morador morador;

    // Opcional: veículo com que a pessoa chegou
    @ManyToOne
    @JoinColumn(name = "VEICULO_ID")
    private Veiculo veiculo;

    @Column(length = 100)
    private String nome;

    @Column(length = 20)
    private String documento;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FinalidadeAcesso finalidade;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime entrada;

    private LocalDateTime saida;

    public Acesso() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ObjetivoAcesso getObjetivo() { return objetivo; }
    public void setObjetivo(ObjetivoAcesso objetivo) { this.objetivo = objetivo; }

    public Visitante getVisitante() { return visitante; }
    public void setVisitante(Visitante visitante) { this.visitante = visitante; }

    public Morador getMorador() { return morador; }
    public void setMorador(Morador morador) { this.morador = morador; }

    public Veiculo getVeiculo() { return veiculo; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public FinalidadeAcesso getFinalidade() { return finalidade; }
    public void setFinalidade(FinalidadeAcesso finalidade) { this.finalidade = finalidade; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getEntrada() { return entrada; }
    public void setEntrada(LocalDateTime entrada) { this.entrada = entrada; }

    public LocalDateTime getSaida() { return saida; }
    public void setSaida(LocalDateTime saida) { this.saida = saida; }
}
