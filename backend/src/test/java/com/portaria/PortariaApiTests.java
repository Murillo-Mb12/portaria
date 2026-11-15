package com.portaria;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.transaction.annotation.Transactional;

import com.jayway.jsonpath.JsonPath;

/**
 * Testes das regras principais chamando a API de verdade (controller -> service -> banco H2).
 * Os dados vêm das migrações (V2): visitante 1 = Ana (visita a moradora 1), visitante 3 = Ricardo
 * (visita o morador 2), veículo 1 = Uno da Ana e do Marcos, funcionário 1 = admin, 2 = porteiro.
 * O @Transactional desfaz tudo ao fim de cada teste, então um teste não interfere no outro.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PortariaApiTests {

    @Autowired
    private WebApplicationContext contexto;

    /** Chamadas sem login (só o que vem do navegador antes de entrar). */
    private MockMvc semLogin;

    /** Chamadas já logado como administrador: toda requisição leva o token. */
    private MockMvc mvc;

    @BeforeEach
    void entrarComoAdministrador() throws Exception {
        semLogin = MockMvcBuilders.webAppContextSetup(contexto)
                .addFilters(contexto.getBean(com.portaria.config.CabecalhosSegurancaFilter.class)).build();
        mvc = comToken(tokenDe("admin", "admin123"));
    }

    // ---------- Login ----------

    @Test
    void loginComSenhaCertaDevolveOPerfil() throws Exception {
        postJson("/api/login", """
                { "usuario": "admin", "senha": "admin123" }""")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil").value("ADMINISTRADOR"));
    }

    @Test
    void loginComSenhaErradaDevolve401() throws Exception {
        postJson("/api/login", """
                { "usuario": "admin", "senha": "errada" }""")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Usuário ou senha inválidos."));
    }

    // ---------- Proteção da API ----------

    @Test
    void loginDevolveUmToken() throws Exception {
        postJson("/api/login", """
                { "usuario": "porteiro", "senha": "1234" }""")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void semLoginAApiRecusaComStatus401() throws Exception {
        semLogin.perform(get("/api/moradores"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Sua sessão expirou. Entre novamente."));
        semLogin.perform(post("/api/acessos/entrada").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInventadoNaoEntra() throws Exception {
        comToken("token-inventado").perform(get("/api/acessos/presentes")).andExpect(status().isUnauthorized());
    }

    @Test
    void porteiroUsaAPortariaMasNaoMexeEmFuncionarios() throws Exception {
        MockMvc porteiro = comToken(tokenDe("porteiro", "1234"));
        porteiro.perform(get("/api/acessos/presentes")).andExpect(status().isOk());
        porteiro.perform(get("/api/funcionarios"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.erro").value("Apenas o administrador pode gerenciar funcionários."));
        porteiro.perform(delete("/api/funcionarios/{id}", 1)).andExpect(status().isForbidden());
    }

    @Test
    void depoisDeSairOTokenNaoValeMais() throws Exception {
        String token = tokenDe("porteiro", "1234");
        MockMvc porteiro = comToken(token);
        porteiro.perform(get("/api/moradores")).andExpect(status().isOk());
        porteiro.perform(post("/api/logout")).andExpect(status().isNoContent());
        porteiro.perform(get("/api/moradores")).andExpect(status().isUnauthorized());
    }

    @Test
    void funcionarioExcluidoPerdeASessao() throws Exception {
        int id = idDe(postJson("/api/funcionarios", """
                { "nome": "Porteiro Noturno", "usuario": "noturno", "senha": "Noturno2026", "perfil": "PORTEIRO" }""")
                .andExpect(status().isCreated()));
        MockMvc noturno = comToken(tokenDe("noturno", "Noturno2026"));
        noturno.perform(get("/api/moradores")).andExpect(status().isOk());

        mvc.perform(delete("/api/funcionarios/{id}", id)).andExpect(status().isNoContent());
        noturno.perform(get("/api/moradores")).andExpect(status().isUnauthorized());
    }

    @Test
    void cincoSenhasErradasBloqueiamOLogin() throws Exception {
        String errada = """
                { "usuario": "porteiro", "senha": "chute-errado" }""";
        for (int i = 0; i < 5; i++) {
            semLogin.perform(post("/api/login").header("X-Real-IP", "10.9.9.9")
                    .contentType(MediaType.APPLICATION_JSON).content(errada))
                    .andExpect(status().isUnauthorized());
        }
        // Bloqueado: nem a senha certa entra agora (por 15 minutos), vindo daquele aparelho
        semLogin.perform(post("/api/login").header("X-Real-IP", "10.9.9.9")
                .contentType(MediaType.APPLICATION_JSON).content("""
                        { "usuario": "porteiro", "senha": "1234" }"""))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.erro").value(org.hamcrest.Matchers.startsWith("Muitas tentativas")));
        // Outro aparelho continua entrando normalmente
        semLogin.perform(post("/api/login").header("X-Real-IP", "10.9.9.10")
                .contentType(MediaType.APPLICATION_JSON).content("""
                        { "usuario": "porteiro", "senha": "1234" }"""))
                .andExpect(status().isOk());
    }

    @Test
    void usuarioInexistenteRecebeAMesmaMensagemDeSenhaErrada() throws Exception {
        semLogin.perform(post("/api/login").header("X-Real-IP", "10.9.9.20")
                .contentType(MediaType.APPLICATION_JSON).content("""
                        { "usuario": "ninguem", "senha": "qualquer" }"""))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Usuário ou senha inválidos."));
    }

    @Test
    void senhaFracaNaoEAceitaParaFuncionario() throws Exception {
        postJson("/api/funcionarios", """
                { "nome": "Fulano", "usuario": "fulano", "senha": "12345678", "perfil": "PORTEIRO" }""")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.senha").value("A senha deve ter pelo menos 8 caracteres, com letras e números"));
        postJson("/api/funcionarios", """
                { "nome": "Fulano", "usuario": "fulano", "senha": "abc1", "perfil": "PORTEIRO" }""")
                .andExpect(status().isBadRequest());
        postJson("/api/funcionarios", """
                { "nome": "Fulano", "usuario": "fulano", "senha": "Portaria2026", "perfil": "PORTEIRO" }""")
                .andExpect(status().isCreated());
    }

    @Test
    void respostasDaApiTrazemCabecalhosDeSeguranca() throws Exception {
        mvc.perform(get("/api/moradores"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("X-Content-Type-Options", "nosniff"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Cache-Control", "no-store"));
    }

    // ---------- Entrada ----------

    @Test
    void visitaRegistradaApareceEmPresentes() throws Exception {
        entradaDaAna().andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Ana Paula Rosa"))
                .andExpect(jsonPath("$.detalhe").value("Visita a Benedita Aparecida Rosa"))
                .andExpect(jsonPath("$.unidade").value("Ala São José - Quarto 04"))
                .andExpect(jsonPath("$.saida").doesNotExist());

        mvc.perform(get("/api/acessos/presentes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nome").value("Ana Paula Rosa"));
    }

    @Test
    void mesmoVisitanteNaoEntraDuasVezes() throws Exception {
        entradaDaAna().andExpect(status().isCreated());
        entradaDaAna().andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("Ana Paula Rosa já está no Lar."));
    }

    @Test
    void visitanteSoVisitaMoradorVinculado() throws Exception {
        // Ana (1) não é visitante do José Carlos (2)
        postJson("/api/acessos/entrada", """
                { "objetivo": "VISITA", "visitanteId": 1, "moradorId": 2 }""")
                .andExpect(status().isConflict());
    }

    @Test
    void veiculoPrecisaSerDoVisitante() throws Exception {
        // O Onix (3) é do Ricardo, não da Ana
        postJson("/api/acessos/entrada", """
                { "objetivo": "VISITA", "visitanteId": 1, "moradorId": 1, "veiculoId": 3 }""")
                .andExpect(status().isConflict());
    }

    @Test
    void doacaoExigeOsItens() throws Exception {
        postJson("/api/acessos/entrada", """
                { "objetivo": "DOACAO", "nome": "Padaria Central" }""")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Descreva os itens doados."));
    }

    @Test
    void mesmoCpfNaoEntraDuasVezesEmDoacaoOuOutros() throws Exception {
        String doacao = """
                { "objetivo": "DOACAO", "nome": "João da Padaria", "documento": "529.982.247-25", "descricao": "Pães" }""";
        postJson("/api/acessos/entrada", doacao).andExpect(status().isCreated());
        postJson("/api/acessos/entrada", doacao).andExpect(status().isConflict());
    }

    // ---------- Saída ----------

    @Test
    void saidaTiraDePresentesESoPodeSerRegistradaUmaVez() throws Exception {
        int id = idDe(entradaDaAna());

        mvc.perform(put("/api/acessos/{id}/saida", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saida").exists());
        mvc.perform(get("/api/acessos/presentes")).andExpect(jsonPath("$", hasSize(0)));

        mvc.perform(put("/api/acessos/{id}/saida", id)).andExpect(status().isConflict());
    }

    @Test
    void saidaRegistradaPorEnganoPodeSerDesfeita() throws Exception {
        int id = idDe(entradaDaAna());
        mvc.perform(put("/api/acessos/{id}/saida", id)).andExpect(status().isOk());

        mvc.perform(delete("/api/acessos/{id}/saida", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saida").doesNotExist());
        mvc.perform(get("/api/acessos/presentes")).andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void naoDesfazSaidaSeOMesmoCpfJaEntrouDeNovo() throws Exception {
        int id = idDe(postJson("/api/acessos/entrada", """
                { "objetivo": "DOACAO", "nome": "João da Padaria", "documento": "529.982.247-25", "descricao": "Pães" }"""));
        mvc.perform(put("/api/acessos/{id}/saida", id)).andExpect(status().isOk());
        postJson("/api/acessos/entrada", """
                { "objetivo": "OUTROS", "nome": "João da Padaria", "documento": "529.982.247-25", "finalidade": "BAZAR" }""")
                .andExpect(status().isCreated());

        mvc.perform(delete("/api/acessos/{id}/saida", id)).andExpect(status().isConflict());
    }

    @Test
    void buscarPelaPalavraNullNaoTrazTudo() throws Exception {
        mvc.perform(get("/api/acessos").param("busca", "null")).andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void registraQualFuncionarioFezAEntradaEASaida() throws Exception {
        // A entrada é registrada pelo administrador (o "mvc" destes testes)
        int id = idDe(entradaDaAna().andExpect(jsonPath("$.entradaPor").value("Administrador"))
                .andExpect(jsonPath("$.saidaPor").doesNotExist()));

        // A saída, pelo porteiro, em outro login
        MockMvc porteiro = comToken(tokenDe("porteiro", "1234"));
        porteiro.perform(put("/api/acessos/{id}/saida", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entradaPor").value("Administrador"))
                .andExpect(jsonPath("$.saidaPor").value("Carlos Porteiro"));

        // Desfazer a saída apaga também quem a registrou
        porteiro.perform(delete("/api/acessos/{id}/saida", id))
                .andExpect(jsonPath("$.saidaPor").doesNotExist());

        // Dá para buscar pelo nome do porteiro na consulta
        mvc.perform(get("/api/acessos").param("busca", "administrador"))
                .andExpect(jsonPath("$[0].nome").value("Ana Paula Rosa"));
    }

    @Test
    void saidaAntigaNaoPodeSerDesfeita() throws Exception {
        // O acesso 1 do exemplo saiu há dois dias
        mvc.perform(delete("/api/acessos/{id}/saida", 1)).andExpect(status().isConflict());
    }

    // ---------- Consulta ----------

    @Test
    void buscaIgnoraAcentosEMaiusculas() throws Exception {
        mvc.perform(get("/api/acessos").param("busca", "JOSE carlos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nome").value("Ricardo Pereira"));
    }

    @Test
    void consultaFiltraPeloPeriodo() throws Exception {
        mvc.perform(get("/api/acessos")).andExpect(jsonPath("$", hasSize(4)));
        mvc.perform(get("/api/acessos").param("de", "2000-01-01").param("ate", "2000-01-31"))
                .andExpect(jsonPath("$", hasSize(0)));
        mvc.perform(get("/api/acessos").param("de", "2026-02-01").param("ate", "2026-01-01"))
                .andExpect(status().isBadRequest());
    }

    // ---------- Cadastros ----------

    @Test
    void cpfInvalidoVoltaComOCampoIndicado() throws Exception {
        postJson("/api/moradores", """
                { "nome": "Fulano", "unidade": "Ala A - Quarto 1", "cpf": "123" }""")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.cpf").exists());
    }

    @Test
    void listasVemEmOrdemAlfabetica() throws Exception {
        mvc.perform(get("/api/visitantes"))
                .andExpect(jsonPath("$[0].nome").value("Ana Paula Rosa"))
                .andExpect(jsonPath("$[1].nome").value("Juliana Santos"))
                .andExpect(jsonPath("$[1].moradores", hasSize(2)));
    }

    @Test
    void editarFuncionarioSemSenhaMantemASenhaAtual() throws Exception {
        mvc.perform(put("/api/funcionarios/{id}", 2).contentType(MediaType.APPLICATION_JSON).content("""
                { "nome": "Carlos da Portaria", "usuario": "porteiro", "senha": null, "perfil": "PORTEIRO" }"""))
                .andExpect(status().isNoContent());

        postJson("/api/login", """
                { "usuario": "porteiro", "senha": "1234" }""")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Carlos da Portaria"));
    }

    @Test
    void novoFuncionarioPrecisaDeSenha() throws Exception {
        postJson("/api/funcionarios", """
                { "nome": "Maria", "usuario": "maria", "senha": "", "perfil": "PORTEIRO" }""")
                .andExpect(status().isBadRequest());
    }

    @Test
    void oUnicoAdministradorNaoPodeSerExcluidoNemRebaixado() throws Exception {
        mvc.perform(delete("/api/funcionarios/{id}", 1)).andExpect(status().isConflict());

        mvc.perform(put("/api/funcionarios/{id}", 1).contentType(MediaType.APPLICATION_JSON).content("""
                { "nome": "Administrador", "usuario": "admin", "senha": null, "perfil": "PORTEIRO" }"""))
                .andExpect(status().isConflict());
    }

    // ---------- Formato de erro ----------

    @Test
    void rotaInexistenteDevolve404NoFormatoPadrao() throws Exception {
        mvc.perform(get("/api/nao-existe"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("Recurso não encontrado."));
    }

    // ---------- Apoio ----------

    private String tokenDe(String usuario, String senha) throws Exception {
        String resposta = semLogin.perform(post("/api/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"usuario\": \"" + usuario + "\", \"senha\": \"" + senha + "\" }"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(resposta, "$.token");
    }

    private MockMvc comToken(String token) {
        return MockMvcBuilders.webAppContextSetup(contexto)
                .addFilters(contexto.getBean(com.portaria.config.CabecalhosSegurancaFilter.class))
                .defaultRequest(get("/").header("Authorization", "Bearer " + token))
                .build();
    }

    private ResultActions postJson(String url, String corpo) throws Exception {
        return mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(corpo));
    }

    /** Ana (visitante 1) visita a Benedita (moradora 1), a pé. */
    private ResultActions entradaDaAna() throws Exception {
        return postJson("/api/acessos/entrada", """
                { "objetivo": "VISITA", "visitanteId": 1, "moradorId": 1 }""");
    }

    private int idDe(ResultActions resposta) throws Exception {
        return JsonPath.read(resposta.andReturn().getResponse().getContentAsString(), "$.id");
    }
}
