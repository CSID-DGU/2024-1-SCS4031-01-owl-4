package org.dgu.backend.auth.info;

import lombok.AllArgsConstructor;
import org.dgu.backend.constant.Provider;

import java.util.Map;

@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getProvider() {
        return Provider.GOOGLE_PROVIDER.getProvider();
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
}