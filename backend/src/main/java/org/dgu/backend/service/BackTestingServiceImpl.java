package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.BackTestingCalculator;
import org.dgu.backend.util.DateUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BackTestingServiceImpl implements BackTestingService {
    private final JwtUtil jwtUtil;
    private final DateUtil dateUtil;
    private final BackTestingCalculator backTestingUtil;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleRepository candleRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingResultRepository tradingResultRepository;
    private final PerformanceResultRepository performanceResultRepository;

    // 백테스팅 결과를 생성하는 메서드
    @Override
    public BackTestingDto.BackTestingResponse createBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo) {
        Candle candle = candleRepository.findByName(stepInfo.getCandleName());
        LocalDateTime startDate = dateUtil.convertToLocalDateTime(stepInfo.getStartDate());
        LocalDateTime endDate = dateUtil.convertToLocalDateTime(stepInfo.getEndDate());

        List<CandleInfo> candles = candleInfoRepository.findFilteredCandleInfo(candle, startDate, endDate);
        candles = backTestingUtil.removeDuplicatedCandles(candles); // 중복 데이터 제거

        // 골든 크로스 지점 찾기
        List<LocalDateTime> goldenCrossPoints = backTestingUtil.findGoldenCrossPoints(candles, stepInfo);

        // 백테스팅 시작
        List<BackTestingDto.BackTestingResult> backTestingResults = backTestingUtil.run(candles, stepInfo, goldenCrossPoints);

        // 백테스팅 결과 집계
        BackTestingDto.BackTestingResponse backTestingResponse = backTestingUtil.collectResults(backTestingResults, stepInfo.getInitialCapital());

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
        if (portfolio.getIsSaved() != 0) {
            throw new PortfolioException(PortfolioErrorResult.IS_ALREADY_SAVED);
        }

        // 포트폴리오 저장 처리
        portfolio.savePortfolio(savingRequest.getComment());
        portfolioRepository.save(portfolio);
    }

    // 백테스팅 결과를 임시 저장하는 메서드
    private void saveTempBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo, BackTestingDto.BackTestingResponse backTestingResponse) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        // 포트폴리오 임시 저장
        Portfolio savedTempPortfolio = saveTempPortfolio(user, stepInfo);
        backTestingResponse.addId(savedTempPortfolio.getPortfolioId()); // 응답에 포트폴리오 ID 추가

        // 포트폴리오 지표 임시 저장
        saveTempPortfolioOption(savedTempPortfolio, stepInfo);

        // 포트폴리오 거래 결과 임시 저장
        saveTempPortfolioTradingResult(savedTempPortfolio, backTestingResponse);

        // 포트폴리오 성능 결과 임시 저장
        saveTempPortfolioPerformanceResult(savedTempPortfolio, backTestingResponse);
    }

    // 포트폴리오를 임시 저장하는 메서드
    private Portfolio saveTempPortfolio(User user, BackTestingDto.StepInfo stepInfo) {
        Portfolio portfolio = Portfolio.builder()
                .user(user)
                .title(stepInfo.getTitle())
                .description(stepInfo.getDescription())
                .build();
        portfolioRepository.save(portfolio);

        return portfolio;
    }

    // 포트폴리오 지표를 임시 저장하는 메서드
    private void saveTempPortfolioOption(Portfolio portfolio, BackTestingDto.StepInfo stepInfo) {
        PortfolioOption portfolioOption = PortfolioOption.builder()
                .portfolio(portfolio)
                .candleName(stepInfo.getCandleName())
                .startDate(LocalDateTime.parse(stepInfo.getStartDate()))
                .endDate(LocalDateTime.parse(stepInfo.getEndDate()))
                .nDate(stepInfo.getNDate())
                .mDate(stepInfo.getMDate())
                .tradingUnit(stepInfo.getTradingUnit())
                .buyingPoint(stepInfo.getBuyingPoint())
                .sellingPoint(stepInfo.getSellingPoint())
                .stopLossPoint(stepInfo.getStopLossPoint())
                .build();
        portfolioOptionRepository.save(portfolioOption);
    }

    // 포트폴리오 거래 결과를 임시 저장하는 메서드
    private void saveTempPortfolioTradingResult(Portfolio portfolio, BackTestingDto.BackTestingResponse backTestingResponse) {
        TradingResult tradingResult = TradingResult.builder()
                .portfolio(portfolio)
                .initialCapital(backTestingResponse.getTrading().getInitialCapital())
                .finalCapital(backTestingResponse.getTrading().getFinalCapital())
                .totalTradeCount(backTestingResponse.getTrading().getTotalTradeCount())
                .positiveTradeCount(backTestingResponse.getTrading().getPositiveTradeCount())
                .negativeTradeCount(backTestingResponse.getTrading().getNegativeTradeCount())
                .averageTradePeriod(backTestingResponse.getTrading().getAverageTradePeriod())
                .averagePositiveTrade(backTestingResponse.getTrading().getAveragePositiveTrade())
                .averageNegativeTrade(backTestingResponse.getTrading().getAverageNegativeTrade())
                .build();
        tradingResultRepository.save(tradingResult);
    }

    // 포트폴리오 성능 결과를 임시 저장하는 메서드
    private void saveTempPortfolioPerformanceResult(Portfolio portfolio, BackTestingDto.BackTestingResponse backTestingResponse) {
        PerformanceResult performanceResult = PerformanceResult.builder()
                .portfolio(portfolio)
                .totalRate(backTestingResponse.getPerformance().getTotalRate())
                .winRate(backTestingResponse.getPerformance().getWinRate())
                .lossRate(backTestingResponse.getPerformance().getLossRate())
                .winLossRatio(backTestingResponse.getPerformance().getWinLossRatio())
                .highValueStrategy(backTestingResponse.getPerformance().getHighValueStrategy())
                .lowValueStrategy(backTestingResponse.getPerformance().getLowValueStrategy())
                .highLossValueStrategy(backTestingResponse.getPerformance().getHighLossValueStrategy())
                .build();
        performanceResultRepository.save(performanceResult);
    }
}