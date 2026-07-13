package com.alexandria.repository;

import com.alexandria.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {
    Optional<Livro> findByIdentificadorExterno(String identificadorExterno);
}
