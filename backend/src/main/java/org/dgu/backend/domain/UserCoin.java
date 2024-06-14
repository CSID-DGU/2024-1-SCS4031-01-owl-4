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

    @Column(name = "coin_name", nullable = false, length = 50)
    private String coinName;

    @Column(name = "coin_count", precision = 20, scale = 10, nullable = false)
    private BigDecimal coinCount;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "rate", nullable = false)
    private BigDecimal rate;

    @Builder
    public UserCoin(User user, String coinName,  BigDecimal coinCount, BigDecimal price, BigDecimal balance, BigDecimal rate) {
        this.user = user;
        this.coinName = coinName;
        this.coinCount = coinCount;
        this.price = price;
        this.balance = balance;
        this.rate = rate;
    }
}