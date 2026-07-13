package com.alexandria.dto.livro;

public record LivroDetalheResponse(
        String identificadorExterno,
        String titulo,
        String autor,
        String descricao,
        String capa,
        String editora,
        String dataPublicacao,
        String categoria,
        Integer numeroPaginas
) {
}
