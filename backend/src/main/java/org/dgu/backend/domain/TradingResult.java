package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "trading_results")
public class TradingResult extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_results_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "trading_results_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "initial_capital", nullable = false)
    private Long initialCapital;

    @Column(name = "final_capital", nullable = false)
    private Long finalCapital;

    @Column(name = "total_trade_count", nullable = false)
    private int totalTradeCount;

    @Column(name = "positive_trade_count", nullable = false)
    private int positiveTradeCount;

    @Column(name = "negative_trade_count", nullable = false)
    private int negativeTradeCount;

    @Column(name = "average_trade_period", nullable = false)
    private int averageTradePeriod;

    @Column(name = "average_positive_trade", nullable = false)
    private Double averagePositiveTrade;

    @Column(name = "average_negative_trade", nullable = false)
    private Double averageNegativeTrade;

    @Builder
    public TradingResult(Portfolio portfolio, Long initialCapital, Long finalCapital, int totalTradeCount, int positiveTradeCount, int negativeTradeCount, int averageTradePeriod, Double averagePositiveTrade, Double averageNegativeTrade){
        this.portfolio = portfolio;
        this.initialCapital = initialCapital;
        this.finalCapital = finalCapital;
        this.totalTradeCount = totalTradeCount;
        this.positiveTradeCount = positiveTradeCount;
        this.negativeTradeCount = negativeTradeCount;
        this.averageTradePeriod = averageTradePeriod;
        this.averagePositiveTrade = averagePositiveTrade;
        this.averageNegativeTrade = averageNegativeTrade;
    }
}