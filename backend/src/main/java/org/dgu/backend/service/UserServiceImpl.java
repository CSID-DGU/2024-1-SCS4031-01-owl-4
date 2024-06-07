package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.UserDto;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.AESUtil;
import org.dgu.backend.util.EncryptionUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.util.Base64;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UpbitKeyRepository upbitKeyRepository;
    private final JwtUtil jwtUtil;
    private final EncryptionUtil encryptionUtil;
    private final AESUtil aesUtil;

    // 유저 업비트 키를 등록하는 메서드
    @Override
    public void addUserUpbitKeys(String authorizationHeader, UserDto.UserUpbitKeyRequest userUpbitKeyRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitKey existUpbitKey = upbitKeyRepository.findByUser(user);

        KeyPair keyPair = encryptionUtil.generateKeyPair();
        String encodedAccessKey = encryptAndEncode(userUpbitKeyRequest.getAccessKey(), keyPair);
        String encodedSecretKey = encryptAndEncode(userUpbitKeyRequest.getSecretKey(), keyPair);
        String encryptedPrivateKey = encryptPrivateKey(keyPair);

        saveUpbitKey(user, encodedAccessKey, encodedSecretKey, encryptedPrivateKey, existUpbitKey);
    }

    // 암호화 및 인코딩 메서드
    private String encryptAndEncode(String data, KeyPair keyPair) {
        byte[] encryptedData = encryptionUtil.encrypt(data.getBytes(), keyPair.getPublic());
        return Base64.getEncoder().encodeToString(encryptedData);
    }

    // 프라이빗 키 암호화 메서드
    private String encryptPrivateKey(KeyPair keyPair) {
        return aesUtil.encrypt(Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded()));
    }

    // 업비트 키 저장 메서드
    private void saveUpbitKey(User user, String encodedAccessKey, String encodedSecretKey, String encryptedPrivateKey, UpbitKey existUpbitKey) {
        // 기존 키 있는 경우 업데이트
        if (existUpbitKey != null) {
            existUpbitKey.updateAccessKey(encodedAccessKey);
            existUpbitKey.updateSecretKey(encodedSecretKey);
            existUpbitKey.updatePrivateKey(encryptedPrivateKey);
            upbitKeyRepository.save(existUpbitKey);
        } else {
            UpbitKey upbitKey = UpbitKey.builder()
                    .user(user)
                    .accessKey(encodedAccessKey)
                    .secretKey(encodedSecretKey)
                    .privateKey(encryptedPrivateKey)
                    .build();
            upbitKeyRepository.save(upbitKey);
        }
    }
}