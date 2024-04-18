package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.RefreshToken;
import org.dgu.backend.dto.response.TokenResponse;
import org.dgu.backend.exception.TokenErrorResult;
import org.dgu.backend.exception.TokenException;
import org.dgu.backend.repository.RefreshTokenRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    @Value("${jwt.access-token.expiration-time}")
    private long ACCESS_TOKEN_EXPIRATION_TIME; // 액세스 토큰 유효기간

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    @Override
    public TokenResponse reissueAccessToken(String authorizationHeader) {
        String refreshToken = jwtUtil.getTokenFromHeader(authorizationHeader);
        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        RefreshToken existRefreshToken = refreshTokenRepository.findByUserId(UUID.fromString(userId));
        String accessToken = null;

        if (!existRefreshToken.getToken().equals(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
            // 리프레쉬 토큰이 다르거나, 만료된 경우
            refreshTokenRepository.delete(existRefreshToken);
            throw new TokenException(TokenErrorResult.INVALID_REFRESH_TOKEN); // 401 에러를 던져 재로그인을 요청
        } else {
            // 액세스 토큰 재발급
            accessToken = jwtUtil.generateAccessToken(UUID.fromString(userId), ACCESS_TOKEN_EXPIRATION_TIME);
        }

        return TokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}