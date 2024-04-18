package org.dgu.backend.repository;

import org.dgu.backend.domain.RefreshToken;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends  JpaRepository<RefreshToken,Long> {
    @Query("SELECT u FROM RefreshToken u WHERE u.userId = :userId")
    RefreshToken findByUserId(UUID userId);
}