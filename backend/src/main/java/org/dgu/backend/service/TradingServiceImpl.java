package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.TradingOption;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.TradingDto;
import org.dgu.backend.exception.PortfolioErrorResult;
import org.dgu.backend.exception.PortfolioException;
import org.dgu.backend.exception.TradingErrorResult;
import org.dgu.backend.exception.TradingException;
import org.dgu.backend.repository.PortfolioOptionRepository;
import org.dgu.backend.repository.PortfolioRepository;
import org.dgu.backend.repository.TradingOptionRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class TradingServiceImpl implements TradingService {
    private final PortfolioRepository portfolioRepository;
    private final PortfolioOptionRepository portfolioOptionRepository;
    private final TradingOptionRepository tradingOptionRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void registerAutoTrading(String authorizationHeader, TradingDto.AutoTradingRequest autoTradingRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        validateUser(user);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(autoTradingRequest.getPortfolioId())
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));
        validatePortfolio(portfolio);

        PortfolioOption portfolioOption = portfolioOptionRepository.findByPortfolio(portfolio)
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO_OPTIONS));

        if (autoTradingRequest.getFund() / portfolioOption.getTradingUnit() < 5000) {
            throw new TradingException(TradingErrorResult.BELOW_MINIMUM_PURCHASE_AMOUNT);
        }

        deleteExistingTradingOptionIfExist(user);

        portfolio.startTrade();
        portfolioRepository.save(portfolio);
        TradingOption tradingOption = autoTradingRequest.to(user, portfolio, portfolioOption);
        tradingOptionRepository.save(tradingOption);
    }

    private void deleteExistingTradingOptionIfExist(User user) {
        TradingOption existingTradingOption = tradingOptionRepository.findByUser(user);
        if (!Objects.isNull(existingTradingOption)) {
            // 기존 자동매매 등록 취소 처리
            cancelAutoTrading(existingTradingOption);
            tradingOptionRepository.deleteTradingOptionById(existingTradingOption.getId());
        }
    }

    private void cancelAutoTrading(TradingOption existingTradingOption) {
        Portfolio existPortfolio = existingTradingOption.getPortfolio();
        existPortfolio.stopTrade();
        portfolioRepository.saveAndFlush(existPortfolio);
    }

    private void validateUser(User user) {
        if (!user.getIsAgree()) {
            throw new TradingException(TradingErrorResult.IS_NOT_AGREED_USER);
        }
        if (Objects.isNull(user.getUpbitKey())) {
            throw new TradingException(TradingErrorResult.HAS_NOT_UPBIT_KEY);
        }
    }

    private void validatePortfolio(Portfolio portfolio) {
        if (!portfolio.getIsSaved()) {
            throw new TradingException(TradingErrorResult.IS_NOT_SAVED_PORTFOLIO);
        }
        if (portfolio.getIsTrade()) {
            throw new TradingException(TradingErrorResult.IS_ALREADY_TRADING);
        }
    }
}