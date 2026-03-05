package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Otopark;
import com.hastane.hastane_backend.repository.OtoparkRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OtoparkService {

    private final OtoparkRepository otoparkRepository;

    public OtoparkService(OtoparkRepository otoparkRepository) {
        this.otoparkRepository = otoparkRepository;
    }

    public Otopark save(Otopark otopark) {

        otopark.setSonGuncelleme(LocalDateTime.now());

        return otoparkRepository.save(otopark);
    }

    public Otopark getLatest() {

        return otoparkRepository.findAll()
                .stream()
                .reduce((first, second) -> second)
                .orElse(null);
    }
}