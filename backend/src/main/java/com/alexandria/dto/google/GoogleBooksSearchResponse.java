package com.alexandria.dto.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleBooksSearchResponse(
        int totalItems,
        List<GoogleBooksVolume> items
) {
}
