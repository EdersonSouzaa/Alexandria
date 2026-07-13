package com.alexandria.dto.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleBooksVolume(
        String id,
        VolumeInfo volumeInfo
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record VolumeInfo(
            String title,
            java.util.List<String> authors,
            String publisher,
            String publishedDate,
            String description,
            Integer pageCount,
            java.util.List<String> categories,
            ImageLinks imageLinks
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ImageLinks(
            String smallThumbnail,
            String thumbnail
    ) {
    }
}
