package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.exception.EncryptionErrorResult;
import org.dgu.backend.exception.EncryptionException;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
@RequiredArgsConstructor
public class EncryptionUtil {
    private static final int KEY_SIZE = 2048;
    private static final int MAX_ENCRYPT_BLOCK = KEY_SIZE / 8 - 11; // RSA 최대 암호화 블록 크기
    private static final int MAX_DECRYPT_BLOCK = KEY_SIZE / 8; // RSA 최대 복호화 블록 크기
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
            return cipherDoFinal(cipher, input, MAX_ENCRYPT_BLOCK);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.RSA_ENCRYPTION_FAILED);
        }
    }

    // RSA 복호화 메서드
    public byte[] decrypt(byte[] input, PrivateKey privateKey) {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return cipherDoFinal(cipher, input, MAX_DECRYPT_BLOCK);
        } catch (Exception e) {
            throw new EncryptionException(EncryptionErrorResult.RSA_DECRYPTION_FAILED);
        }
    }

    // 프라이빗 키 암호화 메서드
    public String encryptPrivateKey(KeyPair keyPair) {
        return aesUtil.encrypt(Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded()));
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
            throw new EncryptionException(EncryptionErrorResult.PRIVATE_KEY_DECRYPTION_FAILED);
        }
    }

    // 암호화 및 인코딩 메서드
    public String encryptAndEncode(String data, KeyPair keyPair) {
        byte[] encryptedData = encrypt(data.getBytes(), keyPair.getPublic());
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    // 복호화 및 인코딩 메서드
    public String decryptAndEncode(String data, PrivateKey privateKey) {
        byte[] decryptedData = decrypt(Base64.getDecoder().decode(data), privateKey);
        return new String(decryptedData);
    }

    // RSA 분할 암호화 및 병합 복호화 메서드
    private byte[] cipherDoFinal(Cipher cipher, byte[] data, int maxBlock) throws Exception {
        int inputLen = data.length;
        int offSet = 0;
        byte[] cache;
        List<Byte> bytes = new ArrayList<>();
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > maxBlock) {
                cache = cipher.doFinal(data, offSet, maxBlock);
            } else {
                cache = cipher.doFinal(data, offSet, inputLen - offSet);
            }
            for (byte b : cache) {
                bytes.add(b);
            }
            offSet += maxBlock;
        }
        byte[] result = new byte[bytes.size()];
        for (int i = 0; i < bytes.size(); i++) {
            result[i] = bytes.get(i);
        }
        return result;
    }
}