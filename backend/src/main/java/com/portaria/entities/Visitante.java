package com.portaria.entities;

import java.util.LinkedHashSet;
import java.util.Set;

import com.portaria.entities.enums.VinculoVisitante;

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

/** Parente, cuidador ou amigo que visita um ou mais moradores. */
@Entity
@Table(name = "TBL_VISITANTE")
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 20)
    private String documento;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VinculoVisitante vinculo;

    // Moradores que este visitante pode visitar.
    // Na entrada, só esses moradores aparecem para ele.
    @ManyToMany
    @JoinTable(name = "TBL_VISITANTE_MORADOR",
            joinColumns = @JoinColumn(name = "VISITANTE_ID"),
            inverseJoinColumns = @JoinColumn(name = "MORADOR_ID"))
    private Set<Morador> moradores = new LinkedHashSet<>();

    public Visitante() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public VinculoVisitante getVinculo() { return vinculo; }
    public void setVinculo(VinculoVisitante vinculo) { this.vinculo = vinculo; }

    public Set<Morador> getMoradores() { return moradores; }
    public void setMoradores(Set<Morador> moradores) { this.moradores = moradores; }
}
