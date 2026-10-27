package com.portaria.entities;

import java.util.LinkedHashSet;
import java.util.Set;

import com.portaria.entities.enums.TipoVeiculo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "TBL_VEICULO")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 7)
    private String placa;

    @Column(nullable = false, length = 40)
    private String marca;

    @Column(nullable = false, length = 40)
    private String modelo;

    @Column(nullable = false, length = 30)
    private String cor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoVeiculo tipo;

    // Usado quando o veículo não é de visitante (ex.: "Lar São Vicente", "Correios")
    @Column(length = 100)
    private String responsavel;

    // Pessoas que usam o carro (ex.: vários membros da mesma família)
    @ManyToMany
    @JoinTable(name = "TBL_VEICULO_VISITANTE",
            joinColumns = @JoinColumn(name = "VEICULO_ID"),
            inverseJoinColumns = @JoinColumn(name = "VISITANTE_ID"))
    private Set<Visitante> pessoas = new LinkedHashSet<>();

    public Veiculo() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }

    public TipoVeiculo getTipo() { return tipo; }
    public void setTipo(TipoVeiculo tipo) { this.tipo = tipo; }

    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String responsavel) { this.responsavel = responsavel; }

    public Set<Visitante> getPessoas() { return pessoas; }
    public void setPessoas(Set<Visitante> pessoas) { this.pessoas = pessoas; }
}
