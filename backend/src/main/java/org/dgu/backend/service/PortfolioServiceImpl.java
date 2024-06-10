package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.*;
import org.dgu.backend.dto.PortfolioDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.repository.*;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {
    private final JwtUtil jwtUtil;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingResultRepository tradingResultRepository;
    private final PerformanceResultRepository performanceResultRepository;

    // 포트폴리오 전체 목록을 가져오는 메서드
    @Override
    public List<PortfolioDto.PortfolioInfos> getPortfolios(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        List<Portfolio> portfolios = portfolioRepository.findAllSavedByUser(user); // 저장된 포트폴리오만 가져옴

        List<PortfolioDto.PortfolioInfos> portfolioInfoGroups = new ArrayList<>();

        for (Portfolio portfolio: portfolios) {
            PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio)
                    .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

            portfolioInfoGroups.add(PortfolioDto.PortfolioInfos.of(portfolio, portfolioOption));
        }

        return portfolioInfoGroups;
    }

    // 특정 포트폴리오 상세 정보를 가져오는 메서드
    @Override
    public PortfolioDto.PortfolioDetailInfos getPortfolioDetails(String authorizationHeader, String portfolioId) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        TradingResult tradingResult = tradingResultRepository.findByPortfolio(portfolio);
        PerformanceResult performanceResult = performanceResultRepository.findByPortfolio(portfolio);
        PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio)
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO_OPTIONS));

        return PortfolioDto.PortfolioDetailInfos.of(portfolio, tradingResult, performanceResult, portfolioOption);
    }

    // 포트폴리오를 삭제하는 메서드
    @Override
    public void removePortfolio(String authorizationHeader, String portfolioId) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByUserAndPortfolioId(user, UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));
        portfolioRepository.delete(portfolio);
    }

    // 포트폴리오 정보를 수정하는 메서드
    @Override
    public PortfolioDto.EditPortfolioResponse editPortfolio(String authorizationHeader, PortfolioDto.EditPortfolioRequest editPortfolioRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByUserAndPortfolioId(user, UUID.fromString(editPortfolioRequest.getPortfolioId()))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        if (!Objects.isNull(editPortfolioRequest.getTitle())) {
            portfolio.updateTitle(editPortfolioRequest.getTitle());
        }

        if (!Objects.isNull(editPortfolioRequest.getDescription())) {
            portfolio.updateDescription(editPortfolioRequest.getDescription());
        }

        if (!Objects.isNull(editPortfolioRequest.getComment())) {
            portfolio.updateComment(editPortfolioRequest.getComment());
        }

        portfolioRepository.save(portfolio);

        return PortfolioDto.EditPortfolioResponse.of(portfolio);
    }

    // 포트폴리오 즐겨찾기를 추가하는 메서드
    @Override
    public void addPortfolioBookMark(String authorizationHeader, String portfolioId) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByUserAndPortfolioId(user, UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        portfolio.addBookMark();
        portfolioRepository.save(portfolio);
    }

    // 포트폴리오 즐겨찾기를 삭제하는 메서드
    @Override
    public void removePortfolioBookMark(String authorizationHeader, String portfolioId) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByUserAndPortfolioId(user, UUID.fromString(portfolioId))
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        portfolio.removeBookMark();
        portfolioRepository.save(portfolio);
    }
}