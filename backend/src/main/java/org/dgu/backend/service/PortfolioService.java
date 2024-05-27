package org.dgu.backend.service;

import org.dgu.backend.dto.PortfolioDto;

import java.util.List;

public interface PortfolioService {
    List<PortfolioDto.PortfolioInfos> getPortfolios(String authorizationHeader);
    PortfolioDto.PortfolioDetailInfos getPortfolioDetails(String authorizationHeader, String portfolioId);
    void removePortfolio(String authorizationHeader, String portfolioId);
}