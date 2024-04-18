package org.dgu.backend.service;

import org.dgu.backend.dto.response.TokenResponse;

public interface AuthService {
    TokenResponse reissueAccessToken(String authorizationHeader);
}