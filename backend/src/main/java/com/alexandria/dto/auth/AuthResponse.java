package com.alexandria.dto.auth;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email
) {
}
