package com.alexandria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gamificacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gamificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private User usuario;

    @Column(nullable = false)
    @Builder.Default
    private int xp = 0;

    @Lob
    @Column(name = "conquistas_desbloqueadas")
    @Convert(converter = StringListJsonConverter.class)
    @Builder.Default
    private List<String> conquistasDesbloqueadas = new ArrayList<>();

    @Lob
    @Column(name = "historico")
    @Convert(converter = HistoricoJsonConverter.class)
    @Builder.Default
    private List<HistoricoItem> historico = new ArrayList<>();

    @Column(name = "total_livros", nullable = false)
    @Builder.Default
    private int totalLivros = 0;

    @Column(name = "total_lidos", nullable = false)
    @Builder.Default
    private int totalLidos = 0;

    @Column(name = "total_avaliacoes", nullable = false)
    @Builder.Default
    private int totalAvaliacoes = 0;

    @Column(name = "total_favoritos", nullable = false)
    @Builder.Default
    private int totalFavoritos = 0;

    @Column(name = "total_posts", nullable = false)
    @Builder.Default
    private int totalPosts = 0;

    @Column(name = "total_abandonados", nullable = false)
    @Builder.Default
    private int totalAbandonados = 0;

    @Column(name = "total_quero_ler", nullable = false)
    @Builder.Default
    private int totalQueroLer = 0;

    @Column(name = "total_lendo", nullable = false)
    @Builder.Default
    private int totalLendo = 0;
}
