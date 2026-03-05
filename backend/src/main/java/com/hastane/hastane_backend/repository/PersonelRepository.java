package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Personel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonelRepository extends JpaRepository<Personel, Integer> {

    Optional<Personel> findByKullanici_Id(Integer kullaniciId);

    // (istersen sonraki adımda tek sorguya çeviririz)
    // Optional<Personel> findByKullanici_TcNo(String tcNo);
}