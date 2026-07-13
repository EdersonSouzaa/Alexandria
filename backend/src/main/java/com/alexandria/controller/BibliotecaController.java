package com.alexandria.controller;

import com.alexandria.dto.biblioteca.AdicionarLivroRequest;
import com.alexandria.dto.biblioteca.AtualizarStatusRequest;
import com.alexandria.dto.biblioteca.ItemBibliotecaResponse;
import com.alexandria.model.StatusLeitura;
import com.alexandria.service.BibliotecaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/biblioteca")
public class BibliotecaController {

    private final BibliotecaService bibliotecaService;

    public BibliotecaController(BibliotecaService bibliotecaService) {
        this.bibliotecaService = bibliotecaService;
    }

    @PostMapping
    public ResponseEntity<ItemBibliotecaResponse> adicionar(@AuthenticationPrincipal Long usuarioId,
                                                              @Valid @RequestBody AdicionarLivroRequest request) {
        return ResponseEntity.ok(bibliotecaService.adicionar(usuarioId, request));
    }

    @GetMapping
    public ResponseEntity<List<ItemBibliotecaResponse>> listar(@AuthenticationPrincipal Long usuarioId,
                                                                 @RequestParam(required = false) StatusLeitura status,
                                                                 @RequestParam(required = false) Boolean favorito) {
        return ResponseEntity.ok(bibliotecaService.listar(usuarioId, status, favorito));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ItemBibliotecaResponse> atualizarStatus(@AuthenticationPrincipal Long usuarioId,
                                                                    @PathVariable Long id,
                                                                    @Valid @RequestBody AtualizarStatusRequest request) {
        return ResponseEntity.ok(bibliotecaService.atualizarStatus(usuarioId, id, request.statusLeitura()));
    }

    @PatchMapping("/{id}/favorito")
    public ResponseEntity<ItemBibliotecaResponse> alternarFavorito(@AuthenticationPrincipal Long usuarioId,
                                                                     @PathVariable Long id) {
        return ResponseEntity.ok(bibliotecaService.alternarFavorito(usuarioId, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@AuthenticationPrincipal Long usuarioId, @PathVariable Long id) {
        bibliotecaService.remover(usuarioId, id);
        return ResponseEntity.noContent().build();
    }
}
