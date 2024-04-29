package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import java.util.UUID;

@Getter
public class RefreshToken {
    @Id
    private UUID userId;
    private String refreshToken;

    public RefreshToken(UUID userId, String refreshToken) {
        this.userId = userId;
        this.refreshToken = refreshToken;
    }
}