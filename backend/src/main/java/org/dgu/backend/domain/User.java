package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.dgu.backend.common.BaseEntity;

import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_id")
    private Long id;

    @Column(name = "users_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID userId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "provider", nullable = false, length = 10)
    private String provider;

    @Column(name = "provider_id", nullable = false, length = 50)
    private String providerId;

    @Column(name = "is_agree", nullable = false)
    private Boolean isAgree;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Portfolio> portfolios;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UpbitKey upbitKey;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCoin> userCoins;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private TradingOption tradingOption;

    @Builder
    public User(UUID userId, String name, String provider, String providerId) {
        this.userId = userId;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.isAgree = false;
    }

    public void updateAgreement() {
        this.isAgree = true;
    }
}