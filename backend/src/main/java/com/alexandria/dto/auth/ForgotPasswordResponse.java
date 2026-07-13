package com.alexandria.dto.auth;

/**
 * Em produção este token seria enviado por e-mail. Sem provedor de e-mail configurado,
 * ele é retornado aqui e também logado no backend — ver README para detalhes.
 */
public record ForgotPasswordResponse(
        String mensagem,
        String resetToken
) {
}
