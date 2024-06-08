package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Table(name = "candles")
public class Candle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candles_id")
    private Long id;

    @Column(name = "candles_name")
    private String candleName;

    @Column(name = "korean_name")
    private String koreanName;

    @OneToMany(mappedBy = "candle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandleInfo> candleInfos;
}