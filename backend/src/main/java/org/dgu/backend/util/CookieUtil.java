package org.dgu.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CookieUtil {
    private final JwtUtil jwtUtil;
    private final String COOKIE_NAME = "refresh_token";

    // 리프레쉬 토큰이 담긴 쿠키를 생성하는 메서드
    public Cookie createCookie(UUID userId, long expirationMillis) {
        String cookieValue = jwtUtil.generateRefreshToken(userId, expirationMillis);
        Cookie cookie = new Cookie(COOKIE_NAME, cookieValue);
        // 쿠키 속성 설정
        cookie.setHttpOnly(true); // httponly 옵션 설정
        cookie.setSecure(true);   // https 옵션 설정
        cookie.setPath("/");      // 모든 곳에서 쿠키열람이 가능하도록 설정
        cookie.setMaxAge((int) expirationMillis); // 쿠키 만료시간 설정
        return cookie;
    }

    // 쿠키를 찾아 반환하는 메서드
    public Cookie getCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(COOKIE_NAME)) {
                    return cookie;
                }
            }
        }

        return null; // 해당하는 쿠키를 찾지 못한 경우 null 반환
    }
}