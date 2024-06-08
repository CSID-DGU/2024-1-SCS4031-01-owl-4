package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.DateUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class BackTestingServiceImpl implements BackTestingService {
    private final JwtUtil jwtUtil;
    private final DateUtil dateUtil;
    private final BackTestingCalculator backTestingCalculator;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleRepository candleRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingResultRepository tradingResultRepository;
    private final PerformanceResultRepository performanceResultRepository;
    private final TradingLogRepository tradingLogRepository;

    // 백테스팅 결과를 생성하는 메서드
    @Override
    public BackTestingDto.BackTestingResponse createBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo) {
        Candle candle = candleRepository.findByCandleName(stepInfo.getCandleName());
        LocalDateTime startDate = dateUtil.convertToLocalDateTime(stepInfo.getStartDate());
        LocalDateTime endDate = dateUtil.convertToLocalDateTime(stepInfo.getEndDate());

        List<CandleInfo> candles = candleInfoRepository.findFilteredCandleInfo(candle, startDate, endDate);
        candles = backTestingCalculator.removeDuplicatedCandles(candles); // 중복 데이터 제거

        // 골든 크로스 지점 찾기
        List<LocalDateTime> goldenCrossPoints = backTestingCalculator.findGoldenCrossPoints(candles, stepInfo);

        // 백테스팅 시작
        List<BackTestingDto.BackTestingResult> backTestingResults = backTestingCalculator.run(candles, stepInfo, goldenCrossPoints);

        // 백테스팅 결과 집계
        BackTestingDto.BackTestingResponse backTestingResponse = backTestingCalculator.collectResults(backTestingResults, stepInfo.getInitialCapital());

        // 회원인 경우 포트폴리오 임시 저장
        if (authorizationHeader != null) {
            saveTempBackTestingResult(authorizationHeader, stepInfo, backTestingResponse);
        }

        return backTestingResponse;
    }

    // 백테스팅 결과를 저장하는 메서드
    @Override
    public void saveBackTestingResult(String authorizationHeader, BackTestingDto.SavingRequest savingRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(savingRequest.getPortfolioId())
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        // 이미 저장된 포트폴리오인 경우
        if (portfolio.getIsSaved()) {
            throw new PortfolioException(PortfolioErrorResult.IS_ALREADY_SAVED);
        }

        // 포트폴리오 저장 처리
        portfolio.savePortfolio(savingRequest.getComment());
        portfolioRepository.save(portfolio);
    }

    // 백테스팅 최근 결과를 반환하는 메서드
    @Override
    public BackTestingDto.BackTestingResponse getRecentBackTestingResult(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findTopByUserOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        TradingResult tradingResult = tradingResultRepository.findByPortfolio(portfolio);
        PerformanceResult performanceResult = performanceResultRepository.findByPortfolio(portfolio);
        List<TradingLog> tradingLogs = tradingLogRepository.findAllByPortfolio(Optional.ofNullable(portfolio));

        return BackTestingDto.BackTestingResponse.of(portfolio, tradingResult, performanceResult, tradingLogs);
    }

    // 백테스팅 결과를 임시 저장하는 메서드
    private void saveTempBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo, BackTestingDto.BackTestingResponse backTestingResponse) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        // 기존에 있던 거래 로그 삭제
        Optional<Portfolio> existPortfolio = portfolioRepository.findTopByUserOrderByCreatedAtDesc(user);

        if (!Objects.isNull(existPortfolio)) {
            List<TradingLog> tradingLogs = tradingLogRepository.findAllByPortfolio(existPortfolio);
            tradingLogRepository.deleteAll(tradingLogs);
        }

        // 포트폴리오 임시 저장
        Portfolio portfolio = stepInfo.toPortfolio(user);
        portfolioRepository.save(portfolio);
        backTestingResponse.addId(portfolio.getPortfolioId()); // 응답에 포트폴리오 ID 추가

        // 포트폴리오 지표 임시 저장
        PortfolioOption portfolioOption = stepInfo.toPortfolioOption(portfolio);
        portfolioOptionRepository.save(portfolioOption);

        // 포트폴리오 거래 결과 임시 저장
        TradingResult tradingResult = backTestingResponse.toTradingResult(portfolio);
        tradingResultRepository.save(tradingResult);

        // 포트폴리오 성능 결과 임시 저장
        PerformanceResult performanceResult = backTestingResponse.toPerformanceResult(portfolio);
        performanceResultRepository.save(performanceResult);

        // 포트폴리오 거래 로그 임시 저장
        List<BackTestingDto.TradingLog> tradingLogs = backTestingResponse.getTradingLogs();
        for (BackTestingDto.TradingLog log : tradingLogs) {
            TradingLog tradingLog = log.toTradingLog(portfolio);
            tradingLogRepository.save(tradingLog);
        }
    }
}