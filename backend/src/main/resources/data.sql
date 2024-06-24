-- 캔들 종류 삽입
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

-- 테스트 유저 삽입
INSERT INTO users (users_id, name, provider, provider_id, users_uuid, is_agree, created_at, updated_at)
VALUES (1, '테스트1', 'kakao', '3471511962', UNHEX(REPLACE('159f4542-ebff-4acd-a603-a4fb4c94526c', '-', '')), false, LOCALTIMESTAMP, LOCALTIMESTAMP),
       (2, '테스트2', 'kakao', '3471511963', UNHEX(REPLACE('159f4542-ebff-4acd-a603-a4fb4c94526d', '-', '')), false, LOCALTIMESTAMP, LOCALTIMESTAMP),
       (3, '테스트3', 'kakao', '3471511964', UNHEX(REPLACE('159f4542-ebff-4acd-a603-a4fb4c94526e', '-', '')), false, LOCALTIMESTAMP, LOCALTIMESTAMP)
ON DUPLICATE KEY UPDATE name = VALUES(name);