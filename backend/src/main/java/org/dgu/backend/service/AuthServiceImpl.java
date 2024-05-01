package org.dgu.backend.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.dgu.backend.domain.RefreshToken;
import org.dgu.backend.dto.TokenDto;
import org.dgu.backend.exception.TokenErrorResult;
import org.dgu.backend.exception.TokenException;
import org.dgu.backend.repository.RefreshTokenRepository;
import org.dgu.backend.util.CookieUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Value("${jwt.access-token.expiration-time}")
    private long ACCESS_TOKEN_EXPIRATION_TIME; // 액세스 토큰 유효기간

    @Value("${jwt.refresh-token.expiration-time}")
    private long REFRESH_TOKEN_EXPIRATION_TIME; // 리프레쉬 토큰 유효기간

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    @Override
    public TokenDto.TokenResponse reissueAccessToken(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = cookieUtil.getCookie(request);
        String refreshToken = cookie.getValue();
        UUID userId = UUID.fromString(jwtUtil.getUserIdFromToken(refreshToken));
        RefreshToken existRefreshToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new TokenException(TokenErrorResult.REFRESH_TOKEN_NOT_FOUND));
        String newAccessToken;

        if (!existRefreshToken.getRefreshToken().equals(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
            // 리프레쉬 토큰이 다르거나, 만료된 경우
            throw new TokenException(TokenErrorResult.INVALID_REFRESH_TOKEN); // 401 에러를 던져 재로그인을 요청
        } else {
            // 액세스 토큰 재발급
            newAccessToken = jwtUtil.generateAccessToken(userId, ACCESS_TOKEN_EXPIRATION_TIME);
        }

        // 리프레쉬 토큰이 담긴 쿠키 생성 후 설정
        Cookie newCookie = cookieUtil.createCookie(userId, REFRESH_TOKEN_EXPIRATION_TIME);
        response.addCookie(newCookie);

        // 새로운 리프레쉬 토큰 Redis 저장
        RefreshToken newRefreshToken = new RefreshToken(userId, newCookie.getValue());
        refreshTokenRepository.save(newRefreshToken);

        // 새로운 액세스 토큰을 담아 반환
        return TokenDto.TokenResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }
}