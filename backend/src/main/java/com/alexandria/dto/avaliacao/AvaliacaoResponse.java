package com.alexandria.dto.avaliacao;

import com.alexandria.dto.livro.LivroResumoResponse;

import java.time.Instant;

public record AvaliacaoResponse(
        Long id,
        LivroResumoResponse livro,
        Integer nota,
        String resenha,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
