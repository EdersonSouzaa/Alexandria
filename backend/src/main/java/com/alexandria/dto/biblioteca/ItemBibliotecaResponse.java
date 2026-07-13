package com.alexandria.dto.biblioteca;

import com.alexandria.dto.livro.LivroResumoResponse;
import com.alexandria.model.StatusLeitura;

import java.time.Instant;

public record ItemBibliotecaResponse(
        Long id,
        LivroResumoResponse livro,
        StatusLeitura statusLeitura,
        boolean favorito,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
