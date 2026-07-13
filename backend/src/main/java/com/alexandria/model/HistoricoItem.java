package com.alexandria.model;

import java.time.Instant;

public record HistoricoItem(
        Instant data,
        String tipo,
        String descricao,
        int xpGanho
) {
}
