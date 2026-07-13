package com.alexandria.controller;

import com.alexandria.dto.gamificacao.GamificacaoStatusResponse;
import com.alexandria.service.GamificacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gamificacao")
public class GamificacaoController {

    private final GamificacaoService gamificacaoService;

    public GamificacaoController(GamificacaoService gamificacaoService) {
        this.gamificacaoService = gamificacaoService;
    }

    @GetMapping
    public ResponseEntity<GamificacaoStatusResponse> consultar(@AuthenticationPrincipal Long usuarioId) {
        return ResponseEntity.ok(gamificacaoService.consultarStatus(usuarioId));
    }
}
