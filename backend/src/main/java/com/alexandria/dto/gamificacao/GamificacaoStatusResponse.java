package com.alexandria.dto.gamificacao;

import java.util.List;

public record GamificacaoStatusResponse(
        int xp,
        int nivel,
        int xpParaProximoNivel,
        List<ConquistaResponse> conquistas,
        List<HistoricoItemResponse> historico,
        EstatisticasResponse estatisticas
) {
}
