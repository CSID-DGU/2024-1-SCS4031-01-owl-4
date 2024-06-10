package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.dgu.backend.common.BaseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "portfolios")
public class Portfolio extends BaseEntity {
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

    @Column(name = "saved_at", length = 20)
    private LocalDateTime savedAt;

    @Column(name = "is_saved", nullable = false)
    private Boolean isSaved;

    @Column(name = "is_marked", nullable = false)
    private Boolean isMarked;

    @Column(name = "is_trade", nullable = false)
    private Boolean isTrade;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private PortfolioOption portfolioOption;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private TradingResult tradingResult;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private PerformanceResult performanceResult;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TradingLog> tradingLogs;

    @OneToOne(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private TradingOption tradingOption;

    @Builder
    public Portfolio(User user, String title, String description) {
        this.user = user;
        this.portfolioId = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.isSaved = false;
        this.isMarked = false;
        this.isTrade = false;
    }

    public void savePortfolio(String comment) {
        this.comment = comment;
        isSaved = true;
        savedAt = LocalDateTime.now();
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void addBookMark() {
        this.isMarked = true;
    }

    public void removeBookMark() {
        this.isMarked = false;
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public void updateComment(String comment) {
        this.comment = comment;
    }

    public void startTrade() {
        this.isTrade = true;
    }

    public void stopTrade() {
        this.isTrade = false;
    }
}