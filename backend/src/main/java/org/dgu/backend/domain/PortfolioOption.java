package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "portfolios_options")
public class PortfolioOption extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolios_options_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "portfolios_options_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "candle_name", nullable = false, length = 20)
    private String candleName;

    @Column(name = "start_date", nullable = false, length = 20)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false, length = 20)
    private LocalDateTime endDate;

    @Column(name = "n_date", nullable = false, length = 5)
    private int nDate;

    @Column(name = "m_date", nullable = false, length = 5)
    private int mDate;

    @Column(name = "trading_unit", nullable = false)
    private int tradingUnit;

    @Column(name = "buying_point", nullable = false, length = 10)
    private Double buyingPoint;

    @Column(name = "selling_point", nullable = false, length = 10)
    private Double sellingPoint;

    @Column(name = "stop_loss_point", nullable = false, length = 10)
    private Double stopLossPoint;

    @Builder
    public PortfolioOption(Portfolio portfolio, String candleName, LocalDateTime startDate, LocalDateTime endDate,
                           int nDate, int mDate, int tradingUnit, Double buyingPoint, Double sellingPoint, Double stopLossPoint){
        this.portfolio = portfolio;
        this.candleName = candleName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.nDate = nDate;
        this.mDate = mDate;
        this.tradingUnit = tradingUnit;
        this.buyingPoint = buyingPoint;
        this.sellingPoint = sellingPoint;
        this.stopLossPoint = stopLossPoint;
    }
}