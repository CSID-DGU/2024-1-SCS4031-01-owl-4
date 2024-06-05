package org.dgu.backend.service;

import org.dgu.backend.dto.DashBoardDto;

public interface DashBoardService {
    DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader);
}
