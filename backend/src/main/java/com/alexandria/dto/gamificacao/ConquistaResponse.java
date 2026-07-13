package com.alexandria.dto.gamificacao;

public record ConquistaResponse(
        String codigo,
        String nome,
        String descricao,
        boolean desbloqueada
) {
}
