package com.alexandria.controller;

import com.alexandria.dto.avaliacao.AtualizarAvaliacaoRequest;
import com.alexandria.dto.avaliacao.AvaliacaoResponse;
import com.alexandria.dto.avaliacao.CriarAvaliacaoRequest;
import com.alexandria.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<AvaliacaoResponse> criar(@AuthenticationPrincipal Long usuarioId,
                                                     @Valid @RequestBody CriarAvaliacaoRequest request) {
        return ResponseEntity.ok(avaliacaoService.criar(usuarioId, request));
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoResponse>> listar(@AuthenticationPrincipal Long usuarioId) {
        return ResponseEntity.ok(avaliacaoService.listar(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoResponse> atualizar(@AuthenticationPrincipal Long usuarioId,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody AtualizarAvaliacaoRequest request) {
        return ResponseEntity.ok(avaliacaoService.atualizar(usuarioId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        avaliacaoService.remover(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportarCsv(@AuthenticationPrincipal Long usuarioId) {
        byte[] csv = avaliacaoService.exportarCsv(usuarioId).getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("avaliacoes.csv").build().toString())
                .body(csv);
    }
}
