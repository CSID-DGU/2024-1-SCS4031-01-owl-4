INSERT INTO candles (candles_name, korean_name) VALUES

                  ('minutes1', '1분봉'),
                  ('minutes3', '3분봉'),
                  ('minutes5', '5분봉'),
                  ('minutes10', '10분봉'),
                  ('minutes15', '15분봉'),
                  ('minutes30', '30분봉'),
                  ('minutes60', '60분봉'),
                  ('minutes240', '240분봉'),
                  ('days', '일봉'),
                  ('weeks', '주봉'),
                  ('months', '월봉')

ON DUPLICATE KEY UPDATE candles_id = candles_id;