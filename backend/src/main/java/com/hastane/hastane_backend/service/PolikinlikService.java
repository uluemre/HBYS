package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Polikinlik;
import com.hastane.hastane_backend.repository.PolikinlikRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolikinlikService {

    private final PolikinlikRepository polikinlikRepository;

    public PolikinlikService(PolikinlikRepository polikinlikRepository) {
        this.polikinlikRepository = polikinlikRepository;
    }

    public Polikinlik save(Polikinlik polikinlik) {
        return polikinlikRepository.save(polikinlik);
    }

    public List<Polikinlik> getAll() {
        return polikinlikRepository.findAll();
    }

    public Polikinlik getById(Integer id) {
        return polikinlikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Polikinlik bulunamadı"));
    }
}