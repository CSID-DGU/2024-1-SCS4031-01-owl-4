package org.dgu.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.dgu.backend.common.BaseEntity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Table(name = "predictions")
public class Prediction extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "predictions_id")
    private Long id;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "close_price")
    private Long closePrice;

    public Prediction(String epochTime, Long closePrice) {
        this.date = LocalDateTime.ofInstant(Instant.ofEpochMilli(Long.parseLong(epochTime)), ZoneOffset.UTC);
        this.closePrice = (long) Math.round(closePrice);
    }
}