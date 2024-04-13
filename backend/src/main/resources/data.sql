CREATE TABLE IF NOT EXISTS candles (
                                       candles_id INT NOT NULL AUTO_INCREMENT,
                                       candles_name VARCHAR(255),
    korean_name VARCHAR(255),
    PRIMARY KEY (candles_id)
    );

INSERT INTO candles (candles_id, candles_name, korean_name)
SELECT * FROM (
                  SELECT 1, 'minutes1', '1분봉' UNION ALL
                  SELECT 2, 'minutes3', '3분봉' UNION ALL
                  SELECT 3, 'minutes5', '5분봉' UNION ALL
                  SELECT 4, 'minutes10', '10분봉' UNION ALL
                  SELECT 5, 'minutes15', '15분봉' UNION ALL
                  SELECT 6, 'minutes30', '30분봉' UNION ALL
                  SELECT 7, 'minutes60', '60분봉' UNION ALL
                  SELECT 8, 'minutes240', '240분봉' UNION ALL
                  SELECT 9, 'days', '일봉' UNION ALL
                  SELECT 10, 'weeks', '주봉' UNION ALL
                  SELECT 11, 'months', '월봉'
              ) AS tmp
WHERE NOT EXISTS (
    SELECT candles_id FROM candles WHERE candles_id IN (1)
);