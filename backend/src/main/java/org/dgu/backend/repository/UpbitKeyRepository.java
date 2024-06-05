package org.dgu.backend.repository;

import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UpbitKeyRepository extends JpaRepository<UpbitKey,Long> {
    UpbitKey findByUser(User user);
}