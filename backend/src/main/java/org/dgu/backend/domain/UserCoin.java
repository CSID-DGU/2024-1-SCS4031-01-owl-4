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
@Table(name = "users_coins")
public class UserCoin extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_coins_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", foreignKey = @ForeignKey(name = "users_coins_fk_users_id"))
    private User user;

    @Column(name = "coin_name", nullable = false, length = 50)
    private String coinName;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Builder
    public UserCoin(User user, String coinName, BigDecimal balance) {
        this.user = user;
        this.coinName = coinName;
        this.balance = balance;
    }
}