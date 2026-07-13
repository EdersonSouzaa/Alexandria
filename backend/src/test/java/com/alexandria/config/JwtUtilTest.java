package com.alexandria.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private static final String SECRET = "chave-de-teste-com-no-minimo-32-caracteres!!";

    @Test
    void deveGerarTokenValidoEExtrairUsuarioId() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 60_000);

        String token = jwtUtil.generateToken(42L, "leitor@alexandria.com");

        assertThat(jwtUtil.isTokenValid(token)).isTrue();
        assertThat(jwtUtil.extractUserId(token)).isEqualTo(42L);
    }

    @Test
    void deveConsiderarTokenExpiradoComoInvalido() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, -1_000);

        String token = jwtUtil.generateToken(1L, "leitor@alexandria.com");

        assertThat(jwtUtil.isTokenValid(token)).isFalse();
    }

    @Test
    void deveConsiderarTokenAdulteradoComoInvalido() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 60_000);
        String token = jwtUtil.generateToken(1L, "leitor@alexandria.com");

        String tokenAdulterado = token.substring(0, token.length() - 2) + "xx";

        assertThat(jwtUtil.isTokenValid(tokenAdulterado)).isFalse();
    }
}
