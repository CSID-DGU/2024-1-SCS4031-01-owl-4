package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.BackTestingDto;
import org.dgu.backend.dto.PortfolioDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingResultRepository tradingResultRepository;
    private final PerformanceResultRepository performanceResultRepository;

    // 포트폴리오 전체 목록을 가져오는 메서드
    @Override
    public List<PortfolioDto.PortfolioInfos> getPortfolios(String authorizationHeader) {
        String token = jwtUtil.getTokenFromHeader(authorizationHeader);
        UUID userId = UUID.fromString(jwtUtil.getUserIdFromToken(token));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        List<Portfolio> portfolios = portfolioRepository.findAllSavedByUser(user); // 저장된 포트폴리오만 가져옴

        List<PortfolioDto.PortfolioInfos> portfolioInfoGroups = new ArrayList<>();
        UUID currentPortfolioId = user.getCurrentPortfolioId();

        for (Portfolio portfolio: portfolios) {
            PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio);

            portfolioInfoGroups.add(PortfolioDto.PortfolioInfos.builder()
                            .portfolioId(portfolio.getPortfolioId())
                            .title(portfolio.getTitle())
                            .startDate(String.valueOf(portfolioOption.getStartDate()))
                            .endDate(String.valueOf(portfolioOption.getEndDate()))
                            .candleName(portfolioOption.getCandleName())
                            .isTrade(Objects.equals(portfolio.getPortfolioId(), currentPortfolioId))
                            .build());
        }

        return portfolioInfoGroups;
    }

    // 특정 포트폴리오 상세 정보를 가져오는 메서드
    @Override
    public PortfolioDto.PortfolioDetailInfos getPortfolioDetails(String authorizationHeader, String portfolioId) {
        String token = jwtUtil.getTokenFromHeader(authorizationHeader);
        UUID userId = UUID.fromString(jwtUtil.getUserIdFromToken(token));
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        Portfolio portfolio = portfolioRepository.findByPortfolioId(UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        TradingResult tradingResult = tradingResultRepository.findByPortfolio(portfolio);
        PerformanceResult performanceResult = performanceResultRepository.findByPortfolio(portfolio);

        return PortfolioDto.PortfolioDetailInfos.builder()
                .description(portfolio.getDescription())
                .comment(portfolio.getComment())
                .trading(createTradingResultResponse(tradingResult))
                .performance(createPerformanceResultResponse(performanceResult))
                .build();
    }

    // 거래 결과 응답 객체를 만드는 메서드
    private BackTestingDto.Trading createTradingResultResponse(TradingResult tradingResult) {
        return BackTestingDto.Trading.builder()
                .initialCapital(tradingResult.getInitialCapital())
                .finalCapital(tradingResult.getFinalCapital())
                .totalTradeCount(tradingResult.getTotalTradeCount())
                .positiveTradeCount(tradingResult.getPositiveTradeCount())
                .negativeTradeCount(tradingResult.getNegativeTradeCount())
                .averageTradePeriod(tradingResult.getAverageTradePeriod())
                .averagePositiveTrade(tradingResult.getAveragePositiveTrade())
                .averageNegativeTrade(tradingResult.getAverageNegativeTrade())
                .build();
    }

    // 성능 결과 응답 객체를 만드는 메서드
    private BackTestingDto.Performance createPerformanceResultResponse(PerformanceResult performanceResult) {
        return BackTestingDto.Performance.builder()
                .totalRate(performanceResult.getTotalRate())
                .winRate(performanceResult.getWinRate())
                .lossRate(performanceResult.getLossRate())
                .winLossRatio(performanceResult.getWinLossRatio())
                .highValueStrategy(performanceResult.getHighValueStrategy())
                .lowValueStrategy(performanceResult.getLowValueStrategy())
                .highLossValueStrategy(performanceResult.getHighLossValueStrategy())
                .build();
    }
}