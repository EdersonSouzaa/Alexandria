package com.alexandria.dto;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String mensagem,
        Map<String, String> erros
) {
    public ErrorResponse(int status, String mensagem) {
        this(Instant.now(), status, mensagem, null);
    }

    public ErrorResponse(int status, String mensagem, Map<String, String> erros) {
        this(Instant.now(), status, mensagem, erros);
    }
}
