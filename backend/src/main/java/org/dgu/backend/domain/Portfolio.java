package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "portfolios")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolios_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "portfolios_fk_users_id"))
    private User user;

    @Column(name = "portfolios_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID portfolioId;

    @Column(name = "title", nullable = false, length = 20)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "comment", length = 50)
    private String comment;

    @Column(name = "trading_start_date", length = 20)
    private LocalDateTime tradingStartDate;

    @Column(name = "trading_end_date", length = 20)
    private LocalDateTime tradingEndDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, length = 20)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", length = 20)
    private LocalDateTime updatedAt;

    @Column(name = "saved_at", length = 20)
    private LocalDateTime savedAt;

    @Column(name = "is_saved", nullable = false, length = 1)
    private int isSaved;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private PortfolioOption portfolioOption;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private TradingResult tradingResult;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private PerformanceResult performanceResult;

    @Builder
    public Portfolio(User user, String title, String description) {
        this.user = user;
        this.portfolioId = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.isSaved = 0;
    }

    public void savePortfolio(String comment) {
        this.comment = comment;
        isSaved = 1;
        savedAt = LocalDateTime.now();
    }
}