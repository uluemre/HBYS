package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Doktor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoktorRepository extends JpaRepository<Doktor, Integer> {

    // ✅ tek sorgu ile: doktor -> kullanici.tcNo üzerinden bul
    Optional<Doktor> findByKullanici_TcNo(String tcNo);

    // (istersen kalsın, kullanici id ile aradığın yerler varsa)
    Optional<Doktor> findByKullanici_Id(Integer kullaniciId);
}