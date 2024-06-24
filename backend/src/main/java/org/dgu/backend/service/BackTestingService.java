package org.dgu.backend.service;

import org.dgu.backend.dto.BackTestingDto;

public interface BackTestingService {
    BackTestingDto.BackTestingResponse createBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo);
    void saveBackTestingResult(String authorizationHeader, BackTestingDto.SavingRequest savingRequest);
    BackTestingDto.BackTestingResponse getRecentBackTestingResult(String authorizationHeader);
}