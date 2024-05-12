package org.dgu.backend.service;

import org.dgu.backend.dto.BackTestingDto;

public interface BackTestingService {
    BackTestingDto.BackTestingResponse runBackTesting(String authorizationHeader, BackTestingDto.StepInfo stepInfo);
    void saveBackTestingResult(String authorizationHeader, BackTestingDto.SavingRequest savingRequest);
}