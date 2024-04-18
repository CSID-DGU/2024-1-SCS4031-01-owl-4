package org.dgu.backend.auth.info;

import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class NaverUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
}