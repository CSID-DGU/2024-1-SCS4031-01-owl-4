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

    @Column(name = "close")
    private Long close;

    public Prediction(String epochTime, Long close) {
        this.date = LocalDateTime.ofInstant(Instant.ofEpochMilli(Long.parseLong(epochTime)), ZoneOffset.UTC);
        this.close = (long) Math.round(close);
    }
}