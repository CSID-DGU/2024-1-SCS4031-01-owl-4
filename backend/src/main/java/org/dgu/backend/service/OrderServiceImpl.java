package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.util.HashUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Value("${upbit.url.order}")
    private String UPBIT_URL_ORDER;
    private final JwtUtil jwtUtil;
    private final UpbitApiClient upbitApiClient;

    // 주문을 진행하는 메서드
    @Override
    @Transactional
    public void executeOrder(Map<String, String> params, UpbitKey upbitKey) {
        String queryString = HashUtil.buildQueryString(params);
        String queryHash = HashUtil.generateQueryHash(queryString);
        String authenticationToken = jwtUtil.generateUpbitOrderToken(upbitKey, queryHash);
        upbitApiClient.createNewOrder(UPBIT_URL_ORDER, authenticationToken, params);
        System.out.println("자동매매에 성공했습니다.");
    }
}