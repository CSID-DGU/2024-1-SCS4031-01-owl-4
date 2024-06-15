package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MarketServiceImpl implements MarketService {
    @Value("${upbit.url.market}")
    private String UPBIT_URL_MARKET;
    private final UpbitApiClient upbitApiClient;
    private final MarketRepository marketRepository;

    // 모든 가상화폐 데이터를 가져와 저장하는 메서드
    @Override
    public void getAllMarkets() {
        UpbitDto.MarketResponse[] responseBody = upbitApiClient.getAllMarketsAtUpbit(UPBIT_URL_MARKET);
        for (UpbitDto.MarketResponse marketResponse : responseBody) {
            // "KRW-"로 시작하는 가상화폐만 저장
            if (marketResponse.getName().startsWith("KRW-")) {
                marketRepository.save(marketResponse.to());
            }
        }
    }
}