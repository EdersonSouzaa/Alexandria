package com.alexandria.dto.biblioteca;

import com.alexandria.model.StatusLeitura;
import jakarta.validation.constraints.NotBlank;

public record AdicionarLivroRequest(
        @NotBlank(message = "O identificador do livro é obrigatório.")
        String identificadorExterno,

        StatusLeitura statusLeitura
) {
}
