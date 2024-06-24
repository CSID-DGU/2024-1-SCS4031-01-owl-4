package org.dgu.backend.service;

import org.dgu.backend.dto.DashBoardDto;

import java.util.List;

public interface DashBoardService {
    DashBoardDto.UserAccountResponse getUserAccount(String authorizationHeader);
    List<DashBoardDto.UserCoinResponse> getUserCoins(String authorizationHeader);
    List<DashBoardDto.RepresentativeCoinResponse> getRepresentativeCoins();
}