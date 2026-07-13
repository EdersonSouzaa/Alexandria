package com.alexandria.repository;

import com.alexandria.model.ComunidadeCurtida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComunidadeCurtidaRepository extends JpaRepository<ComunidadeCurtida, Long> {
    Optional<ComunidadeCurtida> findByUsuarioIdAndPostId(Long usuarioId, Long postId);

    long countByPostId(Long postId);

    boolean existsByUsuarioIdAndPostId(Long usuarioId, Long postId);
}
