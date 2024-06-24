package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "upbit_keys")
public class UpbitKey extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "upbit_keys_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "upbit_keys_fk_users_id"))
    private User user;

    @Column(name = "upbit_keys_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID upbitKeyId;

    @Column(name = "access_key", nullable = false, columnDefinition = "LONGTEXT")
    private String accessKey;

    @Column(name = "secret_key", nullable = false, columnDefinition = "LONGTEXT")
    private String secretKey;

    @Column(name = "private_key", nullable = false, columnDefinition = "LONGTEXT")
    private String privateKey;

    @Builder
    public UpbitKey(User user, String accessKey, String secretKey, String privateKey) {
        this.user = user;
        this.upbitKeyId = UUID.randomUUID();
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.privateKey = privateKey;
    }

    public void updateAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public void updateSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public void updatePrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }
}