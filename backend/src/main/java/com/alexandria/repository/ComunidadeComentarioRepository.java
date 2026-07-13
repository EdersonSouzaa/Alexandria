package com.alexandria.repository;

import com.alexandria.model.ComunidadeComentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComunidadeComentarioRepository extends JpaRepository<ComunidadeComentario, Long> {
    List<ComunidadeComentario> findByPostIdOrderByCriadoEmAsc(Long postId);

    long countByPostId(Long postId);
}
