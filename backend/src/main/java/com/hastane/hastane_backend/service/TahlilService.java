package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Tahlil;
import com.hastane.hastane_backend.repository.TahlilRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TahlilService {

    private final TahlilRepository tahlilRepository;

    public TahlilService(TahlilRepository tahlilRepository) {
        this.tahlilRepository = tahlilRepository;
    }

    public Tahlil create(Tahlil tahlil) {
        tahlil.setTarih(LocalDateTime.now());
        return tahlilRepository.save(tahlil);
    }

    public List<Tahlil> getAll() {
        return tahlilRepository.findAll();
    }

    public List<Tahlil> getByHasta(Long hastaId) {
        return tahlilRepository.findByHastaId(hastaId);
    }

    public List<Tahlil> getByDoktor(Long doktorId) {
        return tahlilRepository.findByDoktorId(doktorId);
    }

    public void delete(Long id) {
        tahlilRepository.deleteById(id);
    }
}