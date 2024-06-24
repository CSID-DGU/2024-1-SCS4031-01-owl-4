package org.dgu.backend.service;

import org.dgu.backend.domain.UpbitKey;

import java.util.Map;

public interface OrderService {
    void executeOrder(Map<String, String> params, UpbitKey upbitKey);
}