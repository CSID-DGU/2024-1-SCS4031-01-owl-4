package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "trading_options")
public class TradingOption extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_options_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "trading_options_fk_users_id"))
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "trading_options_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "initial_capital", nullable = false)
    private Long initialCapital;

    @Column(name = "current_capital", nullable = false)
    private Long currentCapital;

    @Column(name = "avg_price")
    private Double avgPrice;

    @Column(name = "trading_unit_price", nullable = false)
    private Long tradingUnitPrice;

    @Column(name = "coin_count", nullable = false, precision = 30, scale = 15)
    private BigDecimal coinCount;

    @Column(name = "trading_count", nullable = false)
    private int tradingCount;

    @Column(name = "buying_count", nullable = false)
    private int buyingCount;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Builder
    public TradingOption(User user, Portfolio portfolio, Long initialCapital, Long currentCapital, Long tradingUnitPrice, int tradingCount, LocalDateTime startDate, LocalDateTime endDate) {
        this.user = user;
        this.portfolio = portfolio;
        this.initialCapital = initialCapital;
        this.currentCapital = currentCapital;
        this.tradingUnitPrice = tradingUnitPrice;
        this.coinCount = BigDecimal.ZERO;
        this.tradingCount = tradingCount;
        this.buyingCount = 0;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void updateCurrentCapital(Long currentCapital) {
        this.currentCapital = currentCapital;
    }

    public void updateInitialCapital(Long initialCapital) {
        this.initialCapital = initialCapital;
    }

    public void updateAvgPrice(Double avgPrice) {
        this.avgPrice = avgPrice;
    }

    public void updateCoinCount(BigDecimal coinCount) {
        this.coinCount = coinCount;
    }

    public void resetBuyingCount() {
        this.buyingCount= 0;
    }

    public void plusBuyingCount() {
        this.buyingCount++;
    }
}