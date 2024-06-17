package org.dgu.backend.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.dgu.backend.domain.User;
import org.dgu.backend.domain.UserTradingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserTradingLogRepository extends JpaRepository<UserTradingLog,Long> {
    @Query("SELECT utl FROM UserTradingLog utl WHERE utl.user = :user " +
            "AND utl.createdAt > (SELECT MAX(utl2.createdAt) FROM UserTradingLog utl2 WHERE utl2.user = :user AND utl2.type = 'SELL')")
    List<UserTradingLog> findRecentLogsAfterLastSell(@Param("user") User user);

    List<UserTradingLog> findAllByUser(User user);
}