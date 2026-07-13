package com.alexandria.dto.livro;

import java.util.List;

public record BuscaLivrosResponse(
        List<LivroResumoResponse> livros,
        int totalResultados,
        int pagina,
        int tamanhoPagina
) {
}
