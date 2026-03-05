package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Randevu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface RandevuRepository extends JpaRepository<Randevu, Integer> {

    // 🧑 Hastanın randevuları
    List<Randevu> findByHasta_Id(Integer hastaId);

    // 👨‍⚕️ Doktorun randevuları (basit)
    List<Randevu> findByDoktor_Id(Integer doktorId);

    // 👨‍⚕️ Doktorun randevuları (tarih + saat sıralı)
    List<Randevu> findByDoktor_IdOrderByRandevuTarihiAscRandevuSaatiAsc(Integer doktorId);

    // 🔥 Slot kontrolü (aynı doktor + aynı tarih + aynı saat)
    boolean existsByDoktor_IdAndRandevuTarihiAndRandevuSaati(
            Integer doktorId,
            LocalDate randevuTarihi,
            LocalTime randevuSaati
    );
}