package com.alexandria.service;

import com.alexandria.dto.avaliacao.AtualizarAvaliacaoRequest;
import com.alexandria.dto.avaliacao.AvaliacaoResponse;
import com.alexandria.dto.avaliacao.CriarAvaliacaoRequest;
import com.alexandria.dto.livro.LivroResumoResponse;
import com.alexandria.exception.DuplicateResourceException;
import com.alexandria.exception.ResourceNotFoundException;
import com.alexandria.model.Avaliacao;
import com.alexandria.model.Livro;
import com.alexandria.model.User;
import com.alexandria.repository.AvaliacaoRepository;
import com.alexandria.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final UserRepository userRepository;
    private final LivroService livroService;
    private final GamificacaoService gamificacaoService;
    private final ComunidadeService comunidadeService;
    private final CsvExportService csvExportService;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository,
                             UserRepository userRepository,
                             LivroService livroService,
                             GamificacaoService gamificacaoService,
                             ComunidadeService comunidadeService,
                             CsvExportService csvExportService) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.userRepository = userRepository;
        this.livroService = livroService;
        this.gamificacaoService = gamificacaoService;
        this.comunidadeService = comunidadeService;
        this.csvExportService = csvExportService;
    }

    @Transactional
    public AvaliacaoResponse criar(Long usuarioId, CriarAvaliacaoRequest request) {
        Livro livro = livroService.obterOuCriarLivroLocal(request.identificadorExterno());

        if (avaliacaoRepository.existsByUsuarioIdAndLivroId(usuarioId, livro.getId())) {
            throw new DuplicateResourceException("Você já avaliou este livro.");
        }

        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Avaliacao avaliacao = Avaliacao.builder()
                .usuario(usuario)
                .livro(livro)
                .nota(request.nota())
                .resenha(request.resenha())
                .build();
        avaliacao = avaliacaoRepository.save(avaliacao);

        gamificacaoService.avaliacaoCriada(usuarioId);
        comunidadeService.criarPostAutomatico(usuario, livro, avaliacao);

        return paraResponse(avaliacao);
    }

    public List<AvaliacaoResponse> listar(Long usuarioId) {
        return avaliacaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public AvaliacaoResponse atualizar(Long usuarioId, Long avaliacaoId, AtualizarAvaliacaoRequest request) {
        Avaliacao avaliacao = buscarAvaliacao(usuarioId, avaliacaoId);
        avaliacao.setNota(request.nota());
        avaliacao.setResenha(request.resenha());
        return paraResponse(avaliacao);
    }

    @Transactional
    public void remover(Long usuarioId, Long avaliacaoId) {
        Avaliacao avaliacao = buscarAvaliacao(usuarioId, avaliacaoId);
        avaliacaoRepository.delete(avaliacao);
        gamificacaoService.avaliacaoRemovida(usuarioId);
    }

    public String exportarCsv(Long usuarioId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId);
        return csvExportService.exportarAvaliacoes(avaliacoes);
    }

    private Avaliacao buscarAvaliacao(Long usuarioId, Long avaliacaoId) {
        return avaliacaoRepository.findByIdAndUsuarioId(avaliacaoId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação não encontrada."));
    }

    private AvaliacaoResponse paraResponse(Avaliacao avaliacao) {
        Livro livro = avaliacao.getLivro();
        LivroResumoResponse livroResumo = new LivroResumoResponse(
                livro.getIdentificadorExterno(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getCapa(),
                livro.getCategoria(),
                livro.getDataPublicacao()
        );
        return new AvaliacaoResponse(
                avaliacao.getId(),
                livroResumo,
                avaliacao.getNota(),
                avaliacao.getResenha(),
                avaliacao.getCriadoEm(),
                avaliacao.getAtualizadoEm()
        );
    }
}
