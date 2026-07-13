package com.alexandria.dto.gamificacao;

import java.time.Instant;

public record HistoricoItemResponse(
        Instant data,
        String tipo,
        String descricao,
        int xpGanho
) {
}
