package com.alexandria.repository;

import com.alexandria.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<Avaliacao> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<Avaliacao> findByUsuarioIdAndLivroId(Long usuarioId, Long livroId);

    boolean existsByUsuarioIdAndLivroId(Long usuarioId, Long livroId);
}
