package com.alexandria.service;

import com.alexandria.dto.gamificacao.ConquistaResponse;
import com.alexandria.dto.gamificacao.EstatisticasResponse;
import com.alexandria.dto.gamificacao.GamificacaoStatusResponse;
import com.alexandria.dto.gamificacao.HistoricoItemResponse;
import com.alexandria.exception.ResourceNotFoundException;
import com.alexandria.model.Gamificacao;
import com.alexandria.model.HistoricoItem;
import com.alexandria.model.StatusLeitura;
import com.alexandria.repository.GamificacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GamificacaoService {

    private final GamificacaoRepository gamificacaoRepository;

    public GamificacaoService(GamificacaoRepository gamificacaoRepository) {
        this.gamificacaoRepository = gamificacaoRepository;
    }

    @Transactional
    public void livroAdicionado(Long usuarioId, StatusLeitura statusInicial) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalLivros(g.getTotalLivros() + 1);
        ajustarContadorStatus(g, statusInicial, 1);
        registrarAtividade(g, TipoAtividade.LIVRO_ADICIONADO);
        salvarComConquistas(g);
    }

    @Transactional
    public void livroRemovido(Long usuarioId, StatusLeitura statusAtual, boolean favorito) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalLivros(Math.max(0, g.getTotalLivros() - 1));
        ajustarContadorStatus(g, statusAtual, -1);
        if (favorito) {
            g.setTotalFavoritos(Math.max(0, g.getTotalFavoritos() - 1));
        }
        salvarComConquistas(g);
    }

    @Transactional
    public void statusAlterado(Long usuarioId, StatusLeitura statusAntigo, StatusLeitura statusNovo) {
        if (statusAntigo == statusNovo) {
            return;
        }
        Gamificacao g = obterOuCriar(usuarioId);
        ajustarContadorStatus(g, statusAntigo, -1);
        ajustarContadorStatus(g, statusNovo, 1);
        if (statusNovo == StatusLeitura.LIDO) {
            registrarAtividade(g, TipoAtividade.LIVRO_LIDO);
        }
        salvarComConquistas(g);
    }

    @Transactional
    public void favoritoAlternado(Long usuarioId, boolean novoFavorito) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalFavoritos(Math.max(0, g.getTotalFavoritos() + (novoFavorito ? 1 : -1)));
        salvarComConquistas(g);
    }

    @Transactional
    public void avaliacaoCriada(Long usuarioId) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalAvaliacoes(g.getTotalAvaliacoes() + 1);
        registrarAtividade(g, TipoAtividade.AVALIACAO_CRIADA);
        salvarComConquistas(g);
    }

    @Transactional
    public void avaliacaoRemovida(Long usuarioId) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalAvaliacoes(Math.max(0, g.getTotalAvaliacoes() - 1));
        salvarComConquistas(g);
    }

    @Transactional
    public void postCriado(Long usuarioId) {
        Gamificacao g = obterOuCriar(usuarioId);
        g.setTotalPosts(g.getTotalPosts() + 1);
        salvarComConquistas(g);
    }

    @Transactional
    public void curtidaDada(Long usuarioId) {
        Gamificacao g = obterOuCriar(usuarioId);
        registrarAtividade(g, TipoAtividade.CURTIDA_DADA);
        salvarComConquistas(g);
    }

    @Transactional
    public void comentarioCriado(Long usuarioId) {
        Gamificacao g = obterOuCriar(usuarioId);
        registrarAtividade(g, TipoAtividade.COMENTARIO_CRIADO);
        salvarComConquistas(g);
    }

    public GamificacaoStatusResponse consultarStatus(Long usuarioId) {
        Gamificacao g = gamificacaoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Dados de gamificação não encontrados."));

        int nivel = g.getXp() / GamificacaoConstants.XP_POR_NIVEL + 1;
        int xpParaProximoNivel = GamificacaoConstants.XP_POR_NIVEL - (g.getXp() % GamificacaoConstants.XP_POR_NIVEL);

        List<ConquistaResponse> conquistas = GamificacaoConstants.CONQUISTAS.stream()
                .map(a -> new ConquistaResponse(a.codigo(), a.nome(), a.descricao(),
                        g.getConquistasDesbloqueadas().contains(a.codigo())))
                .toList();

        List<HistoricoItemResponse> historico = g.getHistorico().stream()
                .map(h -> new HistoricoItemResponse(h.data(), h.tipo(), h.descricao(), h.xpGanho()))
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        Collections.reverse(historico);

        EstatisticasResponse estatisticas = new EstatisticasResponse(
                g.getTotalLivros(), g.getTotalLidos(), g.getTotalAvaliacoes(), g.getTotalFavoritos(),
                g.getTotalPosts(), g.getTotalAbandonados(), g.getTotalQueroLer(), g.getTotalLendo()
        );

        return new GamificacaoStatusResponse(g.getXp(), nivel, xpParaProximoNivel, conquistas, historico, estatisticas);
    }

    private Gamificacao obterOuCriar(Long usuarioId) {
        return gamificacaoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Dados de gamificação não encontrados."));
    }

    private void ajustarContadorStatus(Gamificacao g, StatusLeitura status, int delta) {
        switch (status) {
            case QUERO_LER -> g.setTotalQueroLer(Math.max(0, g.getTotalQueroLer() + delta));
            case LENDO -> g.setTotalLendo(Math.max(0, g.getTotalLendo() + delta));
            case LIDO -> g.setTotalLidos(Math.max(0, g.getTotalLidos() + delta));
            case ABANDONADO -> g.setTotalAbandonados(Math.max(0, g.getTotalAbandonados() + delta));
        }
    }

    private void registrarAtividade(Gamificacao g, TipoAtividade tipo) {
        g.setXp(g.getXp() + tipo.getXp());

        List<HistoricoItem> historico = new ArrayList<>(g.getHistorico());
        historico.add(new HistoricoItem(Instant.now(), tipo.name(), tipo.getDescricao(), tipo.getXp()));
        if (historico.size() > 100) {
            historico = new ArrayList<>(historico.subList(historico.size() - 100, historico.size()));
        }
        g.setHistorico(historico);
    }

    private void salvarComConquistas(Gamificacao g) {
        List<String> desbloqueadas = new ArrayList<>(g.getConquistasDesbloqueadas());
        boolean alterou = false;
        for (Achievement achievement : GamificacaoConstants.CONQUISTAS) {
            if (!desbloqueadas.contains(achievement.codigo()) && achievement.criterio().test(g)) {
                desbloqueadas.add(achievement.codigo());
                alterou = true;
            }
        }
        if (alterou) {
            g.setConquistasDesbloqueadas(desbloqueadas);
        }
        gamificacaoRepository.save(g);
    }
}
