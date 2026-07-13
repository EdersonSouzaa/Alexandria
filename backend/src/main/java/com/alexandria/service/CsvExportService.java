package com.alexandria.service;

import com.alexandria.model.Avaliacao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CsvExportService {

    private static final String[] CABECALHO = {"Livro", "Autor", "Nota", "Resenha", "Data"};

    public String exportarAvaliacoes(List<Avaliacao> avaliacoes) {
        StringBuilder csv = new StringBuilder();
        csv.append(String.join(",", CABECALHO)).append("\n");

        for (Avaliacao avaliacao : avaliacoes) {
            csv.append(campo(avaliacao.getLivro().getTitulo())).append(",")
                    .append(campo(avaliacao.getLivro().getAutor())).append(",")
                    .append(avaliacao.getNota()).append(",")
                    .append(campo(avaliacao.getResenha())).append(",")
                    .append(campo(avaliacao.getCriadoEm().toString()))
                    .append("\n");
        }

        return csv.toString();
    }

    private String campo(String valor) {
        if (valor == null) {
            return "";
        }
        return "\"" + valor.replace("\"", "\"\"") + "\"";
    }
}
