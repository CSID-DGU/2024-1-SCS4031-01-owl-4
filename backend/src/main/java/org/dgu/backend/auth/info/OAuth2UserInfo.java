package org.dgu.backend.auth.info;

public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getName();
}