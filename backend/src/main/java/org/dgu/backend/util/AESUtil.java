package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.exception.EncryptionErrorResult;
import org.dgu.backend.exception.EncryptionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class AESUtil {

    @Value("${aes.secret}")
    private String SECRET_KEY;

    private SecretKey generateKey() {
        try {
            // 시크릿 키를 SHA-256 해시로 변환하여 32바이트 길이로 만듦
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.SECRET_KEY_GENERATION_FAILED);
        }
    }

    // AES 암호화 메서드
    public String encrypt(String data) {
        try {
            SecretKey secretKey = generateKey();

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.AES_ENCRYPTION_FAILED);
        }
    }

    // AES 복호화 메서드
    public String decrypt(String encryptedData) {
        try {
            SecretKey secretKey = generateKey();

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedData));

            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.AES_DECRYPTION_FAILED);
        }
    }
}