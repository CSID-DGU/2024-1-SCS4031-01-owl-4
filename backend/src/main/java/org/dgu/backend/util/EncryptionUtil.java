package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.exception.EncryptionErrorResult;
import org.dgu.backend.exception.EncryptionException;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class EncryptionUtil {
    private static final int KEY_SIZE = 2048;
    private final AESUtil aesUtil;

    // RSA 암호화에 사용할 키 쌍 생성
    public KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(KEY_SIZE);
            return keyPairGenerator.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            throw new EncryptionException(EncryptionErrorResult.KEY_PAIR_GENERATION_FAILED);
        }
    }

    // RSA 암호화 메서드
    public byte[] encrypt(byte[] input, PublicKey publicKey) {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            return cipher.doFinal(input);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.RSA_ENCRYPTION_FAILED);
        }
    }

    // RSA 복호화 메서드
    public byte[] decrypt(byte[] input, PrivateKey privateKey) {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return cipher.doFinal(input);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.RSA_DECRYPTION_FAILED);
        }
    }

    // 프라이빗 키 복호화 메서드
    public PrivateKey getDecryptedPrivateKey(String encryptedPrivateKey) {
        try {
            String decryptedKey = aesUtil.decrypt(encryptedPrivateKey);
            byte[] keyBytes = Base64.getDecoder().decode(decryptedKey);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePrivate(keySpec);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt private key", e);
        }
    }
}