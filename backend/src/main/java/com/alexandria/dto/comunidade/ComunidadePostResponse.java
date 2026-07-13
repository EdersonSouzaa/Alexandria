package com.alexandria.dto.comunidade;

import java.time.Instant;

public record ComunidadePostResponse(
        Long id,
        Long autorId,
        String autorNome,
        String livroTitulo,
        String livroCapa,
        String conteudo,
        Instant criadoEm,
        long totalCurtidas,
        long totalComentarios,
        boolean curtidoPeloUsuarioAtual
) {
}
