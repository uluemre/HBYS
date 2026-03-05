package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.SikayetOneri;
import com.hastane.hastane_backend.repository.SikayetOneriRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SikayetOneriService {

    private final SikayetOneriRepository repository;

    public SikayetOneriService(SikayetOneriRepository repository) {
        this.repository = repository;
    }

    public SikayetOneri create(SikayetOneri sikayet) {
        sikayet.setTarih(LocalDate.now());
        sikayet.setOncelikDurumu("BEKLEMEDE");
        return repository.save(sikayet);
    }

    public List<SikayetOneri> getAll() {
        return repository.findAll();
    }

    public List<SikayetOneri> getByHasta(Long hastaId) {
        return repository.findByHastaId(hastaId);
    }

    public SikayetOneri cevapla(Long id, String cevap) {
        SikayetOneri sikayet = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kayıt bulunamadı"));

        sikayet.setBashekimCevabi(cevap);
        sikayet.setOncelikDurumu("CEVAPLANDI");

        return repository.save(sikayet);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}