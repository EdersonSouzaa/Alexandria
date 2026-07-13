package com.alexandria.service;

import com.alexandria.dto.livro.BuscaLivrosResponse;
import com.alexandria.dto.livro.LivroDetalheResponse;
import com.alexandria.model.Livro;
import com.alexandria.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LivroService {

    private final GoogleBooksService googleBooksService;
    private final LivroRepository livroRepository;

    public LivroService(GoogleBooksService googleBooksService, LivroRepository livroRepository) {
        this.googleBooksService = googleBooksService;
        this.livroRepository = livroRepository;
    }

    public BuscaLivrosResponse buscar(String termo, String categoria, String ordenar,
                                       int pagina, int tamanhoPagina, boolean qualidadeMinima) {
        return googleBooksService.buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima);
    }

    public LivroDetalheResponse detalhar(String googleId) {
        return googleBooksService.detalhar(googleId);
    }

    @Transactional
    public Livro obterOuCriarLivroLocal(String googleId) {
        return livroRepository.findByIdentificadorExterno(googleId)
                .orElseGet(() -> {
                    LivroDetalheResponse detalhe = googleBooksService.detalhar(googleId);
                    Livro livro = Livro.builder()
                            .identificadorExterno(detalhe.identificadorExterno())
                            .titulo(detalhe.titulo())
                            .autor(detalhe.autor())
                            .descricao(detalhe.descricao())
                            .capa(detalhe.capa())
                            .editora(detalhe.editora())
                            .dataPublicacao(detalhe.dataPublicacao())
                            .categoria(detalhe.categoria())
                            .numeroPaginas(detalhe.numeroPaginas())
                            .build();
                    return livroRepository.save(livro);
                });
    }
}
