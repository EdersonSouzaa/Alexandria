package com.alexandria.dto.comunidade;

import java.time.Instant;

public record ComentarioResponse(
        Long id,
        Long autorId,
        String autorNome,
        String conteudo,
        Instant criadoEm
) {
}
