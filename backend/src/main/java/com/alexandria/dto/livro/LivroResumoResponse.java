package com.alexandria.dto.livro;

public record LivroResumoResponse(
        String identificadorExterno,
        String titulo,
        String autor,
        String capa,
        String categoria,
        String dataPublicacao
) {
}
