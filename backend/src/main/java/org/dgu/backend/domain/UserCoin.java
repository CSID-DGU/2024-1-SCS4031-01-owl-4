package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "users_coins")
public class UserCoin extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_coins_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "users_coins_fk_users_id"))
    private User user;

    @Column(name = "market_name", nullable = false, length = 50)
    private String marketName;

    @Column(name = "korean_name", nullable = false, length = 50)
    private String koreanName;

    @Column(name = "english_name", nullable = false, length = 50)
    private String englishName;

    @Column(name = "coin_count", precision = 20, scale = 10, nullable = false)
    private BigDecimal coinCount;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "rate", nullable = false)
    private BigDecimal rate;

    @Builder
    public UserCoin(User user, String marketName, String koreanName, String englishName, BigDecimal coinCount, BigDecimal price, BigDecimal balance, BigDecimal rate) {
        this.user = user;
        this.marketName = marketName;
        this.koreanName = koreanName;
        this.englishName = englishName;
        this.coinCount = coinCount;
        this.price = price;
        this.balance = balance;
        this.rate = rate;
    }
}