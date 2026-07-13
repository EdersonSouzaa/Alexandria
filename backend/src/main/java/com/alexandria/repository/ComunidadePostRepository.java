package com.alexandria.repository;

import com.alexandria.model.ComunidadePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComunidadePostRepository extends JpaRepository<ComunidadePost, Long> {
    Page<ComunidadePost> findAllByOrderByCriadoEmDesc(Pageable pageable);
}
