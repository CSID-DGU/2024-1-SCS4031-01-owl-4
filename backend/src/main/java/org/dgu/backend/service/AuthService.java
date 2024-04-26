package org.dgu.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.dgu.backend.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse reissueAccessToken(HttpServletRequest request, HttpServletResponse response);
}