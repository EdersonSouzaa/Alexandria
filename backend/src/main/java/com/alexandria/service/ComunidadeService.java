package com.alexandria.service;

import com.alexandria.dto.comunidade.ComentarioRequest;
import com.alexandria.dto.comunidade.ComentarioResponse;
import com.alexandria.dto.comunidade.ComunidadePostResponse;
import com.alexandria.exception.ResourceNotFoundException;
import com.alexandria.model.*;
import com.alexandria.repository.ComunidadeComentarioRepository;
import com.alexandria.repository.ComunidadeCurtidaRepository;
import com.alexandria.repository.ComunidadePostRepository;
import com.alexandria.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComunidadeService {

    private final ComunidadePostRepository postRepository;
    private final ComunidadeCurtidaRepository curtidaRepository;
    private final ComunidadeComentarioRepository comentarioRepository;
    private final UserRepository userRepository;
    private final GamificacaoService gamificacaoService;

    public ComunidadeService(ComunidadePostRepository postRepository,
                              ComunidadeCurtidaRepository curtidaRepository,
                              ComunidadeComentarioRepository comentarioRepository,
                              UserRepository userRepository,
                              GamificacaoService gamificacaoService) {
        this.postRepository = postRepository;
        this.curtidaRepository = curtidaRepository;
        this.comentarioRepository = comentarioRepository;
        this.userRepository = userRepository;
        this.gamificacaoService = gamificacaoService;
    }

    @Transactional
    public void criarPostAutomatico(User usuario, Livro livro, Avaliacao avaliacao) {
        String conteudo = "%s avaliou \"%s\" com nota %d/5.\n\n%s"
                .formatted(usuario.getName(), livro.getTitulo(), avaliacao.getNota(), avaliacao.getResenha());

        ComunidadePost post = ComunidadePost.builder()
                .usuario(usuario)
                .livro(livro)
                .avaliacao(avaliacao)
                .conteudo(conteudo)
                .build();
        postRepository.save(post);

        gamificacaoService.postCriado(usuario.getId());
    }

    public Page<ComunidadePostResponse> listarFeed(Long usuarioIdAtual, Pageable pageable) {
        return postRepository.findAllByOrderByCriadoEmDesc(pageable)
                .map(post -> paraResponse(post, usuarioIdAtual));
    }

    @Transactional
    public ComunidadePostResponse curtir(Long usuarioId, Long postId) {
        ComunidadePost post = buscarPost(postId);

        curtidaRepository.findByUsuarioIdAndPostId(usuarioId, postId)
                .ifPresentOrElse(
                        curtidaRepository::delete,
                        () -> {
                            ComunidadeCurtida curtida = ComunidadeCurtida.builder()
                                    .usuario(referenciaUsuario(usuarioId))
                                    .post(post)
                                    .build();
                            curtidaRepository.save(curtida);
                            gamificacaoService.curtidaDada(usuarioId);
                        }
                );

        return paraResponse(post, usuarioId);
    }

    @Transactional
    public ComentarioResponse comentar(Long usuarioId, Long postId, ComentarioRequest request) {
        ComunidadePost post = buscarPost(postId);

        ComunidadeComentario comentario = ComunidadeComentario.builder()
                .usuario(referenciaUsuario(usuarioId))
                .post(post)
                .conteudo(request.conteudo())
                .build();
        comentario = comentarioRepository.save(comentario);

        gamificacaoService.comentarioCriado(usuarioId);

        return paraResponseComentario(comentario);
    }

    public List<ComentarioResponse> listarComentarios(Long postId) {
        return comentarioRepository.findByPostIdOrderByCriadoEmAsc(postId).stream()
                .map(this::paraResponseComentario)
                .toList();
    }

    private ComunidadePost buscarPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicação não encontrada."));
    }

    private User referenciaUsuario(Long usuarioId) {
        return userRepository.getReferenceById(usuarioId);
    }

    private ComunidadePostResponse paraResponse(ComunidadePost post, Long usuarioIdAtual) {
        long totalCurtidas = curtidaRepository.countByPostId(post.getId());
        long totalComentarios = comentarioRepository.countByPostId(post.getId());
        boolean curtido = usuarioIdAtual != null && curtidaRepository.existsByUsuarioIdAndPostId(usuarioIdAtual, post.getId());

        return new ComunidadePostResponse(
                post.getId(),
                post.getUsuario().getId(),
                post.getUsuario().getName(),
                post.getLivro() != null ? post.getLivro().getTitulo() : null,
                post.getLivro() != null ? post.getLivro().getCapa() : null,
                post.getConteudo(),
                post.getCriadoEm(),
                totalCurtidas,
                totalComentarios,
                curtido
        );
    }

    private ComentarioResponse paraResponseComentario(ComunidadeComentario comentario) {
        return new ComentarioResponse(
                comentario.getId(),
                comentario.getUsuario().getId(),
                comentario.getUsuario().getName(),
                comentario.getConteudo(),
                comentario.getCriadoEm()
        );
    }
}
