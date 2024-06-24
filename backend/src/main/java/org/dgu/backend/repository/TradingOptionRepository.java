package org.dgu.backend.repository;

import jakarta.transaction.Transactional;
import org.dgu.backend.domain.TradingOption;
import org.dgu.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface TradingOptionRepository extends JpaRepository<TradingOption,Long> {
    TradingOption findByUser(User user);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from TradingOption where id = :id")
    void deleteTradingOptionById(Long id);
}