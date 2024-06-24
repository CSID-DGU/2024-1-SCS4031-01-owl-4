package org.dgu.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.dgu.backend.dto.TokenDto;

public interface AuthService {
    TokenDto.TokenResponse reissueAccessToken(HttpServletRequest request, HttpServletResponse response);
    void logout(HttpServletResponse response);
}