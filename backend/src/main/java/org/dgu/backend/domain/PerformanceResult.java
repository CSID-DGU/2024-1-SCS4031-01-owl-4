package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "performance_results")
public class PerformanceResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performance_results_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolios_id", foreignKey = @ForeignKey(name = "performance_results_fk_portfolios_id"))
    private Portfolio portfolio;

    @Column(name = "total_rate", nullable = false)
    private Double totalRate;

    @Column(name = "win_rate", nullable = false)
    private Double winRate;

    @Column(name = "loss_rate", nullable = false)
    private Double lossRate;

    @Column(name = "win_loss_ratio", nullable = false)
    private Double winLossRatio;

    @Column(name = "high_value_strategy", nullable = false)
    private Long highValueStrategy;

    @Column(name = "low_value_strategy", nullable = false)
    private Long lowValueStrategy;

    @Column(name = "high_loss_value_strategy", nullable = false)
    private Long highLossValueStrategy;

    @Builder
    public PerformanceResult(Portfolio portfolio, Double totalRate, Double winRate, Double lossRate, Double winLossRatio, Long highValueStrategy, Long lowValueStrategy, Long highLossValueStrategy){
        this.portfolio = portfolio;
        this.totalRate = totalRate;
        this.winRate = winRate;
        this.lossRate = lossRate;
        this.winLossRatio = winLossRatio;
        this.highValueStrategy = highValueStrategy;
        this.lowValueStrategy = lowValueStrategy;
        this.highLossValueStrategy = highLossValueStrategy;
    }
}