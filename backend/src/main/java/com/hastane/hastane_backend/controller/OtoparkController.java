package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Otopark;
import com.hastane.hastane_backend.repository.OtoparkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/otopark")
public class OtoparkController {

    private final OtoparkRepository otoparkRepository;

    public OtoparkController(OtoparkRepository otoparkRepository) {
        this.otoparkRepository = otoparkRepository;
    }

    // 🔥 PYTHON İÇİN
    @PostMapping("/guncelle/{aracSayisi}")
    public ResponseEntity<?> updateParking(@PathVariable Integer aracSayisi) {

        Otopark otopark = otoparkRepository.findAll()
                .stream()
                .findFirst()
                .orElse(new Otopark());

        otopark.setMevcutAracSayisi(aracSayisi);
        otopark.setSonGuncelleme(LocalDateTime.now());

        otoparkRepository.save(otopark);

        return ResponseEntity.ok("Veri alındı: " + aracSayisi);
    }

    // React için
    @GetMapping
    public Otopark getLatest() {
        return otoparkRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}