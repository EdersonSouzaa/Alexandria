package com.alexandria.service;

import java.util.List;

public final class GamificacaoConstants {

    public static final int XP_POR_NIVEL = 100;

    public static final List<Achievement> CONQUISTAS = List.of(
            new Achievement("PRIMEIRO_LIVRO", "Primeiro Livro",
                    "Adicione o primeiro livro à sua biblioteca.",
                    g -> g.getTotalLivros() >= 1),
            new Achievement("LEITOR_INICIANTE", "Leitor Iniciante",
                    "Marque 5 livros como lidos.",
                    g -> g.getTotalLidos() >= 5),
            new Achievement("LEITOR_VORAZ", "Leitor Voraz",
                    "Marque 20 livros como lidos.",
                    g -> g.getTotalLidos() >= 20),
            new Achievement("CRITICO_LITERARIO", "Crítico Literário",
                    "Escreva 5 avaliações.",
                    g -> g.getTotalAvaliacoes() >= 5),
            new Achievement("RESENHISTA", "Resenhista",
                    "Escreva 20 avaliações.",
                    g -> g.getTotalAvaliacoes() >= 20),
            new Achievement("COLECIONADOR", "Colecionador",
                    "Marque 10 livros como favoritos.",
                    g -> g.getTotalFavoritos() >= 10),
            new Achievement("SOCIAVEL", "Sociável",
                    "Gere 5 publicações na comunidade.",
                    g -> g.getTotalPosts() >= 5),
            new Achievement("EXPLORADOR", "Explorador",
                    "Adicione 50 livros à sua biblioteca.",
                    g -> g.getTotalLivros() >= 50),
            new Achievement("LENDARIO", "Lendário",
                    "Acumule 1000 pontos de experiência.",
                    g -> g.getXp() >= 1000)
    );

    private GamificacaoConstants() {
    }
}
