package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.SikayetOneri;
import com.hastane.hastane_backend.service.SikayetOneriService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sikayetler")
public class SikayetOneriController {

    private final SikayetOneriService service;

    public SikayetOneriController(SikayetOneriService service) {
        this.service = service;
    }

    @PostMapping
    public SikayetOneri create(@RequestBody SikayetOneri sikayet) {
        return service.create(sikayet);
    }

    @GetMapping
    public List<SikayetOneri> getAll() {
        return service.getAll();
    }

    @GetMapping("/hasta/{hastaId}")
    public List<SikayetOneri> getByHasta(@PathVariable Long hastaId) {
        return service.getByHasta(hastaId);
    }

    @PutMapping("/cevapla/{id}")
    public SikayetOneri cevapla(@PathVariable Long id,
                                @RequestBody String cevap) {
        return service.cevapla(id, cevap);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}