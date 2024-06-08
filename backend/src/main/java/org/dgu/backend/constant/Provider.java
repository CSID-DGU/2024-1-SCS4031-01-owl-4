package org.dgu.backend.constant;

public enum Provider {
    GOOGLE_PROVIDER("google"),
    KAKAO_PROVIDER("kakao"),
    NAVER_PROVIDER("naver");

    private final String provider;

    Provider(String provider) {
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}