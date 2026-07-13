package com.alexandria.dto.auth;

import java.time.Instant;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        Instant criadoEm
) {
}
