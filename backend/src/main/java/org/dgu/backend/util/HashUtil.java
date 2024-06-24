package org.dgu.backend.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class HashUtil {
    public static String buildQueryString(Map<String, String> params) {
        List<String> queryElements = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            queryElements.add(entry.getKey() + "=" + entry.getValue());
        }
        return String.join("&", queryElements);
    }

    public static String generateQueryHash(String queryString) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(queryString.getBytes("UTF-8"));
            byte[] hashBytes = md.digest();
            return String.format("%0128x", new BigInteger(1, hashBytes));
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException("SHA-512 해시 생성 실패: " + e.getMessage(), e);
        }
    }
}