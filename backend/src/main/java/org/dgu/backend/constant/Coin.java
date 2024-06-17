package org.dgu.backend.constant;

public enum Coin {
    BITCOIN("KRW-BTC", "비트코인", "Bitcoin"),
    ETHEREUM("KRW-ETH", "이더리움", "Ethereum"),
    BITCOIN_CASH("KRW-BCH", "비트코인캐시", "Bitcoin Cash"),
    SOLANA("KRW-SOL", "솔라나", "Solana"),
    AAVE("KRW-AAVE", "에이브", "Aave"),
    AVALANCHE("KRW-AVAX", "아발란체", "Avalanche"),
    NEO("KRW-NEO", "네오", "NEO"),
    TAIKO("KRW-TAIKO", "타이코", "Taiko"),
    STACKS("KRW-STX", "스택스", "Stacks"),
    RIPPLE("KRW-XRP", "리플", "Ripple"),
    DOGECOIN("KRW-DOGE", "도지코인", "Dogecoin"),
    WAVE("KRW-WAVES", "웨이브", "Waves");

    private final String marketName;
    private final String koreanName;
    private final String englishName;

    Coin(String marketName, String koreanName, String englishName) {
        this.marketName = marketName;
        this.koreanName = koreanName;
        this.englishName = englishName;
    }

    public String getMarketName() {
        return marketName;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public String getEnglishName() {
        return englishName;
    }
}