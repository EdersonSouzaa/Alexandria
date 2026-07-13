package com.alexandria.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Converter
public class HistoricoJsonConverter implements AttributeConverter<List<HistoricoItem>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final TypeReference<List<HistoricoItem>> TYPE = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(List<HistoricoItem> attribute) {
        return MAPPER.writeValueAsString(attribute == null ? List.of() : attribute);
    }

    @Override
    public List<HistoricoItem> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return List.of();
        }
        return MAPPER.readValue(dbData, TYPE);
    }
}
