package com.alexandria.service;

public enum TipoAtividade {
    LIVRO_ADICIONADO("Livro adicionado à biblioteca", 5),
    LIVRO_LIDO("Livro marcado como lido", 20),
    AVALIACAO_CRIADA("Avaliação publicada", 15),
    COMENTARIO_CRIADO("Comentário publicado", 5),
    CURTIDA_DADA("Curtida em uma publicação", 2);

    private final String descricao;
    private final int xp;

    TipoAtividade(String descricao, int xp) {
        this.descricao = descricao;
        this.xp = xp;
    }

    public String getDescricao() {
        return descricao;
    }

    public int getXp() {
        return xp;
    }
}
