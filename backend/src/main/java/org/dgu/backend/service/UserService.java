package org.dgu.backend.service;

import org.dgu.backend.dto.UserDto;

public interface UserService {
    void addUserUpbitKeys(String authorizationHeader, UserDto.UserUpbitKeyRequest userUpbitKeyRequest);
}