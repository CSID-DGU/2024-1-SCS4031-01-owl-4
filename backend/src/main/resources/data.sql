INSERT INTO candles (candles_id, candles_name, korean_name) VALUES
                  (1, 'minutes1', '1분봉'),
                  (2, 'minutes3', '3분봉'),
                  (3, 'minutes5', '5분봉'),
                  (4, 'minutes10', '10분봉'),
                  (5, 'minutes15', '15분봉'),
                  (6, 'minutes30', '30분봉'),
                  (7, 'minutes60', '60분봉'),
                  (8, 'minutes240', '240분봉'),
                  (9, 'days', '일봉'),
                  (10, 'weeks', '주봉'),
                  (11, 'months', '월봉')

ON DUPLICATE KEY UPDATE candles_id = candles_id;