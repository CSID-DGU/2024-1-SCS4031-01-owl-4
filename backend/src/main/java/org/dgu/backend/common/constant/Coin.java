package org.dgu.backend.common.constant;

public enum Coin {
    BITCOIN("KRW-BTC", "비트코인"),
    ETHEREUM("KRW-ETH", "이더리움"),
    RIPPLE("KRW-XRP", "리플"),
    DOGECOIN("KRW-DOGE", "도지코인"),
    WAVE("KRW-WAVES", "웨이브");

    private final String marketName;
    private final String koreanName;

    Coin(String marketName, String koreanName) {
        this.marketName = marketName;
        this.koreanName = koreanName;
    }

    public String getMarketName() {
        return marketName;
    }

    public String getKoreanName() {
        return koreanName;
    }
}