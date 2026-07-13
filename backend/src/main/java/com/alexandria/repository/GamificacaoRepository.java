package com.alexandria.repository;

import com.alexandria.model.Gamificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamificacaoRepository extends JpaRepository<Gamificacao, Long> {
    Optional<Gamificacao> findByUsuarioId(Long usuarioId);
}
