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

    @Column(name = "start_capital", nullable = false)
    private BigDecimal startCapital;

    @Column(name = "avg_price")
    private BigDecimal avgPrice;

    @Column(name = "trading_unit_price", nullable = false)
    private BigDecimal tradingUnitPrice;

    @Column(name = "remained_buying_count", nullable = false)
    private int remainedBuyingCount;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Builder
    public TradingOption(User user, Portfolio portfolio, BigDecimal startCapital, BigDecimal tradingUnitPrice, int remainedBuyingCount, LocalDateTime startDate, LocalDateTime endDate) {
        this.user = user;
        this.portfolio = portfolio;
        this.startCapital = startCapital;
        this.tradingUnitPrice = tradingUnitPrice;
        this.remainedBuyingCount = remainedBuyingCount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void updateAvgPrice(BigDecimal avgPrice) {
        this.avgPrice = avgPrice;
    }
}