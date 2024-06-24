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
@Table(name = "trading_logs")
public class TradingLog extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_logs_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "trading_logs_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "capital", nullable = false)
    private Long capital;

    @Column(name = "coin", nullable = false)
    private BigDecimal coin;

    @Column(name = "coin_price", nullable = false)
    private Long coinPrice;

    @Column(name = "rate", nullable = false)
    private Double rate;

    @Builder
    public TradingLog(Portfolio portfolio, String type, LocalDateTime date, Long capital, BigDecimal coin, Long coinPrice, Double rate){
        this.portfolio = portfolio;
        this.type = type;
        this.date = date;
        this.capital = capital;
        this.coin = coin;
        this.coinPrice = coinPrice;
        this.rate = rate;
    }
}