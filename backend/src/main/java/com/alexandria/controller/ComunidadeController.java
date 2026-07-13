package com.alexandria.controller;

import com.alexandria.dto.comunidade.ComentarioRequest;
import com.alexandria.dto.comunidade.ComentarioResponse;
import com.alexandria.dto.comunidade.ComunidadePostResponse;
import com.alexandria.service.ComunidadeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunidade/posts")
public class ComunidadeController {

    private final ComunidadeService comunidadeService;

    public ComunidadeController(ComunidadeService comunidadeService) {
        this.comunidadeService = comunidadeService;
    }

    @GetMapping
    public ResponseEntity<Page<ComunidadePostResponse>> listarFeed(
            @AuthenticationPrincipal Long usuarioId,
            @RequestParam(required = false, defaultValue = "0") int pagina,
            @RequestParam(required = false, defaultValue = "20") int tamanhoPagina
    ) {
        return ResponseEntity.ok(comunidadeService.listarFeed(usuarioId, PageRequest.of(pagina, tamanhoPagina)));
    }

    @PostMapping("/{id}/curtir")
    public ResponseEntity<ComunidadePostResponse> curtir(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        return ResponseEntity.ok(comunidadeService.curtir(usuarioId, id));
    }

    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<ComentarioResponse>> listarComentarios(@PathVariable Long id) {
        return ResponseEntity.ok(comunidadeService.listarComentarios(id));
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<ComentarioResponse> comentar(@AuthenticationPrincipal Long usuarioId,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody ComentarioRequest request) {
        return ResponseEntity.ok(comunidadeService.comentar(usuarioId, id, request));
    }
}
