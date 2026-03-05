package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KullaniciRepository extends JpaRepository<Kullanici, Integer> {
    Optional<Kullanici> findByTcNo(String tcNo);
}