package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.BackTestingUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BackTestingServiceImpl implements BackTestingService {
    private final JwtUtil jwtUtil;
    private final BackTestingUtil backTestingUtil;
    private final UserRepository userRepository;
    private final CandleInfoRepository candleInfoRepository;
    private final CandleRepository candleRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingResultRepository tradingResultRepository;
    private final PerformanceResultRepository performanceResultRepository;

    // 백테스팅 실행
    @Override
    public BackTestingDto.BackTestingResponse runBackTesting(String authorizationHeader, BackTestingDto.StepInfo stepInfo) {
        Candle candle = candleRepository.findByName(stepInfo.getCandleName());

        // 캔들 ID에 해당하는 모든 CandleInfo 가져옴
        List<CandleInfo> allCandleInfoList = candleInfoRepository.findAllByCandleId(candle.getId());

        // 설정한 기간에 맞는 차트만 필터링
        List<CandleInfo> filteredCandleInfoList = backTestingUtil.getFilteredCandleInfoList(allCandleInfoList, stepInfo.getStartDate(), stepInfo.getEndDate());

        // N일 EMA 계산
        List<BackTestingDto.EMAInfo> nDateEMAs = backTestingUtil.calculateEMA(filteredCandleInfoList, stepInfo.getNDate());
        // M일 EMA 계산
        List<BackTestingDto.EMAInfo> mDateEMAs = backTestingUtil.calculateEMA(filteredCandleInfoList, stepInfo.getMDate());

        // 골든 크로스 지점 찾기
        List<LocalDateTime> goldenCrossPoints = backTestingUtil.findGoldenCrossPoints(nDateEMAs, mDateEMAs);

        // 백테스팅 시작
        List<BackTestingDto.BackTestingResult> backTestingResults = backTestingUtil.run(filteredCandleInfoList, stepInfo, goldenCrossPoints);

        // 백테스팅 결과 도출
        BackTestingDto.BackTestingResponse backTestingResponse = backTestingUtil.collectResults(backTestingResults, stepInfo.getInitialCapital());

        // 회원인 경우 포트폴리오 임시 저장
        if (authorizationHeader != null) {
            String token = jwtUtil.getTokenFromHeader(authorizationHeader);
            UUID userId = UUID.fromString(jwtUtil.getUserIdFromToken(token));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

            // 포트폴리오 임시 저장
            Portfolio portfolio = Portfolio.builder()
                    .user(user)
                    .title(stepInfo.getTitle())
                    .description(stepInfo.getDescription())
                    .build();
            portfolioRepository.save(portfolio);

            backTestingResponse.addId(portfolio.getPortfolioId()); // 응답에 포트폴리오 ID 추가

            // 포트폴리오 지표 임시 저장
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

            // 포트폴리오 거래 결과 임시 저장
            TradingResult tradingResult = TradingResult.builder()
                    .portfolio(portfolio) // 포트폴리오 정보 설정
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

            // 포트폴리오 성능 결과 임시 저장
            PerformanceResult performanceResult = PerformanceResult.builder()
                    .portfolio(portfolio) // 포트폴리오 정보 설정
                    .totalRate(backTestingResponse.getPerformance().getTotalRate())
                    .winRate(backTestingResponse.getPerformance().getWinRate())
                    .lossRate(backTestingResponse.getPerformance().getLossRate())
                    .winLossRatio(backTestingResponse.getPerformance().getWinLossRatio())
                    .highValueStrategy(backTestingResponse.getPerformance().getHighValueStrategy())
                    .lowValueStrategy(backTestingResponse.getPerformance().getLowValueStrategy())
                    .highLossValueStrategy(backTestingResponse.getPerformance().getHighLossValueStrategy()) // 이 값은 백테스팅 결과에 따라 설정해야 합니다.
                    .build();
            performanceResultRepository.save(performanceResult);
        }

        return backTestingResponse;
    }

    @Override
    public void saveBackTestingResult(String authorizationHeader, BackTestingDto.SavingRequest savingRequest) {
        String token = jwtUtil.getTokenFromHeader(authorizationHeader);
        UUID userId = UUID.fromString(jwtUtil.getUserIdFromToken(token));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

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
}