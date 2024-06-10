package org.dgu.backend.repository;

import jakarta.transaction.Transactional;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UpbitKeyRepository extends JpaRepository<UpbitKey,Long> {
    UpbitKey findByUser(User user);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from UpbitKey where id = :id")
    void deleteUpbitKeyById(Long id);
}