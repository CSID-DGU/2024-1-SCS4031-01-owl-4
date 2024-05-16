package org.dgu.backend.service;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Portfolio;
import org.dgu.backend.domain.PortfolioOption;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.PortfolioDto;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.PortfolioOptionRepository;
import org.dgu.backend.repository.PortfolioRepository;
import org.dgu.backend.repository.UserRepository;
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
                            .title(portfolio.getTitle())
                            .startDate(String.valueOf(portfolioOption.getStartDate()))
                            .endDate(String.valueOf(portfolioOption.getEndDate()))
                            .candleName(portfolioOption.getCandleName())
                            .isTrade(Objects.equals(portfolio.getPortfolioId(), currentPortfolioId))
                            .build());
        }

        return portfolioInfoGroups;
    }
}