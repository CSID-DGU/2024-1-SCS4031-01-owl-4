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
@Table(name = "users_trading_logs")
public class UserTradingLog extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_logs_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "users_trading_logs_fk_portfolios_id"))
    private User user;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "capital", nullable = false)
    private Long capital;

    @Column(name = "coin", nullable = false, precision = 30, scale = 15)
    private BigDecimal coin;

    @Column(name = "coin_price", nullable = false)
    private Double coinPrice;

    @Column(name = "rate", nullable = false)
    private Double rate;

    @Builder
    public UserTradingLog(User user, String type, Long capital, BigDecimal coin, Double coinPrice, Double rate){
        this.user = user;
        this.type = type;
        this.capital = capital;
        this.coin = coin;
        this.coinPrice = coinPrice;
        this.rate = rate;
    }
}