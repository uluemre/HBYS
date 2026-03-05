package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.*;
import com.hastane.hastane_backend.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RandevuService {

    private final RandevuRepository randevuRepository;
    private final HastaRepository hastaRepository;
    private final DoktorRepository doktorRepository;

    public RandevuService(RandevuRepository randevuRepository,
                          HastaRepository hastaRepository,
                          DoktorRepository doktorRepository) {

        this.randevuRepository = randevuRepository;
        this.hastaRepository = hastaRepository;
        this.doktorRepository = doktorRepository;
    }

    public Randevu create(Integer hastaId, Integer doktorId, Randevu randevu) {

        // 🔥 NULL KORUMA
        if (hastaId == null) {
            throw new RuntimeException("Hasta ID null olamaz");
        }

        if (doktorId == null) {
            throw new RuntimeException("Doktor ID null olamaz");
        }

        Hasta hasta = hastaRepository.findById(hastaId)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));

        Doktor doktor = doktorRepository.findById(doktorId)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));

        boolean doluMu = randevuRepository
                .existsByDoktor_IdAndRandevuTarihiAndRandevuSaati(
                        doktorId,
                        randevu.getRandevuTarihi(),
                        randevu.getRandevuSaati()
                );

        if (doluMu) {
            throw new RuntimeException("Bu doktor bu tarih ve saatte dolu");
        }

        randevu.setHasta(hasta);
        randevu.setDoktor(doktor);
        randevu.setDurum(RandevuDurum.BEKLEMEDE);

        return randevuRepository.save(randevu);
    }

    public List<Randevu> getByHasta(Integer hastaId) {
        return randevuRepository.findByHasta_Id(hastaId);
    }
}