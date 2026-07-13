package com.alexandria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "livros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identificador_externo", nullable = false, unique = true)
    private String identificadorExterno;

    @Column(nullable = false)
    private String titulo;

    private String autor;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String capa;

    private String editora;

    @Column(name = "data_publicacao")
    private String dataPublicacao;

    private String categoria;

    @Column(name = "numero_paginas")
    private Integer numeroPaginas;
}
