package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "portfolios_results")
public class PortfolioResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolios_results_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "portfolios_results_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "buying_count", nullable = false, length = 10)
    private int buyingCount;

    @Column(name = "selling_count", nullable = false, length = 10)
    private int sellingCount;

    @Column(name = "income", nullable = false)
    private Long income;

    @Column(name = "return_rate", nullable = false, length = 10)
    private Double returnRate;

    @Column(name = "winning_rate", nullable = false, length = 10)
    private Double winningRate;

    @Builder
    public PortfolioResult(Portfolio portfolio, int buyingCount, int sellingCount, Long income, Double returnRate, Double winningRate){
        this.portfolio = portfolio;
        this.buyingCount = buyingCount;
        this.sellingCount = sellingCount;
        this.income = income;
        this.returnRate = returnRate;
        this.winningRate = winningRate;
    }
}