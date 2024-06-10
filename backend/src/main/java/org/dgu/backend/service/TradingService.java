package org.dgu.backend.service;

import org.dgu.backend.dto.TradingDto;

public interface TradingService {
    void registerAutoTrading(String authorizationHeader, TradingDto.AutoTradingRequest autoTradingRequest);
}