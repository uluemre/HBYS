package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.SikayetOneri;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SikayetOneriRepository extends JpaRepository<SikayetOneri, Long> {

    List<SikayetOneri> findByHastaId(Long hastaId);

    List<SikayetOneri> findByOncelikDurumu(String oncelikDurumu);
}