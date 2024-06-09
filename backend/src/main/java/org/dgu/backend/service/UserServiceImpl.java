package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.UserDto;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.EncryptionUtil;
import org.dgu.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.security.KeyPair;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UpbitKeyRepository upbitKeyRepository;
    private final JwtUtil jwtUtil;
    private final EncryptionUtil encryptionUtil;

    // 유저 업비트 키를 등록하는 메서드
    @Override
    public void addUserUpbitKeys(String authorizationHeader, UserDto.UserUpbitKeyRequest userUpbitKeyRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        UpbitKey existUpbitKey = upbitKeyRepository.findByUser(user);

        KeyPair keyPair = encryptionUtil.generateKeyPair();
        String encodedAccessKey = encryptionUtil.encryptAndEncode(userUpbitKeyRequest.getAccessKey(), keyPair);
        String encodedSecretKey = encryptionUtil.encryptAndEncode(userUpbitKeyRequest.getSecretKey(), keyPair);
        String encryptedPrivateKey = encryptionUtil.encryptPrivateKey(keyPair);

        saveUpbitKey(user, encodedAccessKey, encodedSecretKey, encryptedPrivateKey, existUpbitKey);
    }

    // 서비스 약관 동의 여부를 등록하는 메서드
    @Override
    public void addUserAgreement(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        // 이미 등록한 경우
        if (user.getIsAgree()) {
            throw new UserException(UserErrorResult.ALREADY_AGREED);
        }
        user.updateAgreement();
    }

    // 서비스 약관 동의 여부를 조회하는 메서드
    @Override
    public UserDto.getUserAgreementResponse getUserAgreement(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        return UserDto.getUserAgreementResponse.of(user);
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