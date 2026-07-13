package com.alexandria.dto.biblioteca;

import com.alexandria.model.StatusLeitura;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(
        @NotNull(message = "O status de leitura é obrigatório.")
        StatusLeitura statusLeitura
) {
}
