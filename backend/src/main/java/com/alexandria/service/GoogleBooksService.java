package com.alexandria.service;

import com.alexandria.config.CacheConfig;
import com.alexandria.dto.google.GoogleBooksSearchResponse;
import com.alexandria.dto.google.GoogleBooksVolume;
import com.alexandria.dto.livro.BuscaLivrosResponse;
import com.alexandria.dto.livro.LivroDetalheResponse;
import com.alexandria.dto.livro.LivroResumoResponse;
import com.alexandria.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class GoogleBooksService {

    private static final int TAMANHO_PAGINA_MAXIMO = 40;

    private final RestClient restClient;
    private final String apiKey;
    private final String lang;
    private final String country;

    public GoogleBooksService(@Value("${app.google-books.base-url}") String baseUrl,
                               @Value("${app.google-books.api-key}") String apiKey,
                               @Value("${app.google-books.lang}") String lang,
                               @Value("${app.google-books.country}") String country) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.lang = lang;
        this.country = country;
    }

    @Cacheable(cacheNames = CacheConfig.CACHE_BUSCA_LIVROS,
            key = "#termo + '|' + #categoria + '|' + #ordenar + '|' + #pagina + '|' + #tamanhoPagina + '|' + #qualidadeMinima")
    public BuscaLivrosResponse buscar(String termo, String categoria, String ordenar,
                                       int pagina, int tamanhoPagina, boolean qualidadeMinima) {
        int paginaFinal = Math.max(pagina, 0);
        int tamanhoFinal = Math.min(Math.max(tamanhoPagina, 1), TAMANHO_PAGINA_MAXIMO);

        String termoBase = termo == null || termo.isBlank() ? "*" : termo;
        String query = categoria != null && !categoria.isBlank()
                ? termoBase + "+subject:" + categoria
                : termoBase;

        String orderBy = "recentes".equalsIgnoreCase(ordenar) ? "newest" : "relevance";

        GoogleBooksSearchResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/volumes")
                        .queryParam("q", query)
                        .queryParam("startIndex", paginaFinal * tamanhoFinal)
                        .queryParam("maxResults", tamanhoFinal)
                        .queryParam("orderBy", orderBy)
                        .queryParam("langRestrict", lang)
                        .queryParam("country", country)
                        .queryParamIfPresent("key", apiKeyOptional())
                        .build())
                .retrieve()
                .body(GoogleBooksSearchResponse.class);

        List<LivroResumoResponse> livros = response == null || response.items() == null
                ? List.of()
                : response.items().stream()
                .filter(item -> item.volumeInfo() != null && item.volumeInfo().title() != null)
                .filter(item -> !qualidadeMinima || temQualidadeMinima(item.volumeInfo()))
                .map(this::paraResumo)
                .toList();

        int total = response == null ? 0 : response.totalItems();
        return new BuscaLivrosResponse(livros, total, paginaFinal, tamanhoFinal);
    }

    @Cacheable(cacheNames = CacheConfig.CACHE_DETALHE_LIVRO, key = "#googleId")
    public LivroDetalheResponse detalhar(String googleId) {
        GoogleBooksVolume volume;
        try {
            volume = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/volumes/{id}")
                            .queryParamIfPresent("key", apiKeyOptional())
                            .build(googleId))
                    .retrieve()
                    .body(GoogleBooksVolume.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResourceNotFoundException("Livro não encontrado no Google Books.");
        }

        if (volume == null || volume.volumeInfo() == null) {
            throw new ResourceNotFoundException("Livro não encontrado no Google Books.");
        }

        return paraDetalhe(volume);
    }

    private boolean temQualidadeMinima(GoogleBooksVolume.VolumeInfo info) {
        boolean temCapa = info.imageLinks() != null && info.imageLinks().thumbnail() != null;
        boolean temDescricao = info.description() != null && !info.description().isBlank();
        return temCapa || temDescricao;
    }

    private LivroResumoResponse paraResumo(GoogleBooksVolume volume) {
        var info = volume.volumeInfo();
        return new LivroResumoResponse(
                volume.id(),
                info.title(),
                autores(info.authors()),
                capa(info),
                categoria(info),
                info.publishedDate()
        );
    }

    private LivroDetalheResponse paraDetalhe(GoogleBooksVolume volume) {
        var info = volume.volumeInfo();
        return new LivroDetalheResponse(
                volume.id(),
                info.title(),
                autores(info.authors()),
                info.description(),
                capa(info),
                info.publisher(),
                info.publishedDate(),
                categoria(info),
                info.pageCount()
        );
    }

    private String autores(List<String> authors) {
        return authors == null || authors.isEmpty() ? null : String.join(", ", authors);
    }

    private String categoria(GoogleBooksVolume.VolumeInfo info) {
        return info.categories() == null || info.categories().isEmpty() ? null : info.categories().get(0);
    }

    private String capa(GoogleBooksVolume.VolumeInfo info) {
        return info.imageLinks() == null ? null : info.imageLinks().thumbnail();
    }

    private java.util.Optional<String> apiKeyOptional() {
        return apiKey == null || apiKey.isBlank() ? java.util.Optional.empty() : java.util.Optional.of(apiKey);
    }
}
