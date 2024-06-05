package org.dgu.backend.repository;

import org.dgu.backend.domain.UserCoin;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserCoinRepository extends JpaRepository<UserCoin,Long> {
    UserCoin findByCoinName(String coinName);
}