package org.dgu.backend.service;

import org.dgu.backend.dto.BackTestingDto;

public interface BackTestingService {
    BackTestingDto.BackTestingResult runBackTesting(String authorizationHeader, BackTestingDto.StepInfo stepInfo);
}
