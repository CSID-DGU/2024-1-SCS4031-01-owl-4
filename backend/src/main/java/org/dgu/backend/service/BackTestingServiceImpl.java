package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.util.BackTestingUtil;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BackTestingServiceImpl implements BackTestingService {
    private final BackTestingUtil backTestingUtil;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleRepository candleRepository;

    // 백테스팅 실행
    @Override
    public BackTestingDto.BackTestingResult runBackTesting(String authorizationHeader, BackTestingDto.StepInfo stepInfo) {
        Candle candle = candleRepository.findByName(stepInfo.getCandleName());

        // 캔들 ID에 해당하는 모든 CandleInfo 가져옴
        List<CandleInfo> allCandleInfoList = candleInfoRepository.findAllByCandleId(candle.getId());

        // 설정한 기간에 맞는 차트만 필터링
        List<CandleInfo> filteredCandleInfoList = backTestingUtil.getFilteredCandleInfoList(allCandleInfoList, stepInfo.getStartDate(), stepInfo.getEndDate());

        // N일 EMA 계산
        List<BackTestingDto.EMAInfo> nDateEMAs = backTestingUtil.calculateEMA(filteredCandleInfoList, stepInfo.getNDate());
        // M일 EMA 계산
        List<BackTestingDto.EMAInfo> mDateEMAs = backTestingUtil.calculateEMA(filteredCandleInfoList, stepInfo.getMDate());

        return null;
    }
}