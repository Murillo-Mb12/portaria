package com.portaria;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// Os testes usam o H2 em memória, então não precisam do PostgreSQL rodando
@SpringBootTest
@ActiveProfiles("h2")
class PortariaApplicationTests {

    @Test
    void contextLoads() {
    }
}
