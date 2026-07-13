package com.alexandria.service;

import com.alexandria.dto.biblioteca.AdicionarLivroRequest;
import com.alexandria.dto.biblioteca.ItemBibliotecaResponse;
import com.alexandria.dto.livro.LivroResumoResponse;
import com.alexandria.exception.DuplicateResourceException;
import com.alexandria.exception.ResourceNotFoundException;
import com.alexandria.model.ItemBiblioteca;
import com.alexandria.model.Livro;
import com.alexandria.model.StatusLeitura;
import com.alexandria.model.User;
import com.alexandria.repository.ItemBibliotecaRepository;
import com.alexandria.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BibliotecaService {

    private final ItemBibliotecaRepository itemBibliotecaRepository;
    private final UserRepository userRepository;
    private final LivroService livroService;
    private final GamificacaoService gamificacaoService;

    public BibliotecaService(ItemBibliotecaRepository itemBibliotecaRepository,
                              UserRepository userRepository,
                              LivroService livroService,
                              GamificacaoService gamificacaoService) {
        this.itemBibliotecaRepository = itemBibliotecaRepository;
        this.userRepository = userRepository;
        this.livroService = livroService;
        this.gamificacaoService = gamificacaoService;
    }

    @Transactional
    public ItemBibliotecaResponse adicionar(Long usuarioId, AdicionarLivroRequest request) {
        Livro livro = livroService.obterOuCriarLivroLocal(request.identificadorExterno());

        if (itemBibliotecaRepository.existsByUsuarioIdAndLivroId(usuarioId, livro.getId())) {
            throw new DuplicateResourceException("Este livro já está na sua biblioteca.");
        }

        User usuario = userRepository.getReferenceById(usuarioId);
        StatusLeitura status = request.statusLeitura() == null ? StatusLeitura.QUERO_LER : request.statusLeitura();

        ItemBiblioteca item = ItemBiblioteca.builder()
                .usuario(usuario)
                .livro(livro)
                .statusLeitura(status)
                .build();
        item = itemBibliotecaRepository.save(item);

        gamificacaoService.livroAdicionado(usuarioId, status);

        return paraResponse(item);
    }

    public List<ItemBibliotecaResponse> listar(Long usuarioId, StatusLeitura filtroStatus, Boolean favorito) {
        return itemBibliotecaRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
                .filter(item -> filtroStatus == null || item.getStatusLeitura() == filtroStatus)
                .filter(item -> favorito == null || item.isFavorito() == favorito)
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public ItemBibliotecaResponse atualizarStatus(Long usuarioId, Long itemId, StatusLeitura novoStatus) {
        ItemBiblioteca item = buscarItem(usuarioId, itemId);
        StatusLeitura statusAntigo = item.getStatusLeitura();
        item.setStatusLeitura(novoStatus);

        gamificacaoService.statusAlterado(usuarioId, statusAntigo, novoStatus);

        return paraResponse(item);
    }

    @Transactional
    public ItemBibliotecaResponse alternarFavorito(Long usuarioId, Long itemId) {
        ItemBiblioteca item = buscarItem(usuarioId, itemId);
        item.setFavorito(!item.isFavorito());

        gamificacaoService.favoritoAlternado(usuarioId, item.isFavorito());

        return paraResponse(item);
    }

    @Transactional
    public void remover(Long usuarioId, Long itemId) {
        ItemBiblioteca item = buscarItem(usuarioId, itemId);
        itemBibliotecaRepository.delete(item);
        gamificacaoService.livroRemovido(usuarioId, item.getStatusLeitura(), item.isFavorito());
    }

    private ItemBiblioteca buscarItem(Long usuarioId, Long itemId) {
        return itemBibliotecaRepository.findByIdAndUsuarioId(itemId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Item da biblioteca não encontrado."));
    }

    private ItemBibliotecaResponse paraResponse(ItemBiblioteca item) {
        Livro livro = item.getLivro();
        LivroResumoResponse livroResumo = new LivroResumoResponse(
                livro.getIdentificadorExterno(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getCapa(),
                livro.getCategoria(),
                livro.getDataPublicacao()
        );
        return new ItemBibliotecaResponse(
                item.getId(),
                livroResumo,
                item.getStatusLeitura(),
                item.isFavorito(),
                item.getCriadoEm(),
                item.getAtualizadoEm()
        );
    }
}
