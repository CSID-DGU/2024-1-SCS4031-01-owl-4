package org.dgu.backend.service;

import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.TradingOption;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.TradingDto;

public interface TradingService {
    void registerAutoTrading(String authorizationHeader, TradingDto.AutoTradingRequest autoTradingRequest);
    void removeAutoTrading(String authorizationHeader, String portfolioId);
    void executeTrade(User user, PortfolioOption portfolioOption, TradingOption tradingOption, Double curPrice);
}