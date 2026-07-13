package com.alexandria.controller;

import com.alexandria.dto.livro.BuscaLivrosResponse;
import com.alexandria.dto.livro.LivroDetalheResponse;
import com.alexandria.service.LivroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<BuscaLivrosResponse> buscar(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false, defaultValue = "relevancia") String ordenar,
            @RequestParam(required = false, defaultValue = "0") int pagina,
            @RequestParam(required = false, defaultValue = "20") int tamanhoPagina,
            @RequestParam(required = false, defaultValue = "true") boolean qualidadeMinima
    ) {
        return ResponseEntity.ok(livroService.buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima));
    }

    @GetMapping("/google/{id}")
    public ResponseEntity<LivroDetalheResponse> detalhar(@PathVariable String id) {
        return ResponseEntity.ok(livroService.detalhar(id));
    }
}
