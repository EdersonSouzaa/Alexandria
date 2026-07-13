package com.alexandria.repository;

import com.alexandria.model.ItemBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemBibliotecaRepository extends JpaRepository<ItemBiblioteca, Long> {
    List<ItemBiblioteca> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    Optional<ItemBiblioteca> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<ItemBiblioteca> findByUsuarioIdAndLivroId(Long usuarioId, Long livroId);

    boolean existsByUsuarioIdAndLivroId(Long usuarioId, Long livroId);
}
