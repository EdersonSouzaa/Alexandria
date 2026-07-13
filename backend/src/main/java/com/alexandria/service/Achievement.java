package com.alexandria.service;

import com.alexandria.model.Gamificacao;

import java.util.function.Predicate;

public record Achievement(
        String codigo,
        String nome,
        String descricao,
        Predicate<Gamificacao> criterio
) {
}
