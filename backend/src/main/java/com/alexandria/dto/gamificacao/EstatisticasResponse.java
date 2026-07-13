package com.alexandria.dto.gamificacao;

public record EstatisticasResponse(
        int totalLivros,
        int totalLidos,
        int totalAvaliacoes,
        int totalFavoritos,
        int totalPosts,
        int totalAbandonados,
        int totalQueroLer,
        int totalLendo
) {
}
