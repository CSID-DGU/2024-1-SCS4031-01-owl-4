package org.dgu.backend.repository;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.RefreshToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {
    @Value("${jwt.refresh-token.expiration-time}")
    private long REFRESH_TOKEN_EXPIRATION_TIME; // 리프레쉬 토큰 유효기간

    private final RedisTemplate redisTemplate;

    public void save(final RefreshToken refreshToken) {
        ValueOperations<UUID, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(refreshToken.getUserId(), refreshToken.getRefreshToken());
        redisTemplate.expire(refreshToken.getRefreshToken(), REFRESH_TOKEN_EXPIRATION_TIME, TimeUnit.MILLISECONDS);
    }

    public Optional<RefreshToken> findByUserId(final UUID userId) {
        ValueOperations<UUID, String> valueOperations = redisTemplate.opsForValue();
        String refreshToken = valueOperations.get(userId);

        if (Objects.isNull(refreshToken)) {
            return Optional.empty();
        }

        return Optional.of(new RefreshToken(userId, refreshToken));
    }
}