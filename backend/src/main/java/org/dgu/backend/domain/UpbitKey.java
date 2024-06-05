package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "upbit_keys")
public class UpbitKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "upbit_keys_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "upbit_keys_fk_users_id"))
    private User user;

    @Column(name = "upbit_keys_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID upbitKey;

    @Column(name = "access_key", nullable = false, length = 50)
    private String accessKey;

    @Column(name = "secret_key", nullable = false, length = 10)
    private String secretKey;
}