package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Tahlil;
import com.hastane.hastane_backend.service.TahlilService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tahliller")
public class TahlilController {

    private final TahlilService tahlilService;

    public TahlilController(TahlilService tahlilService) {
        this.tahlilService = tahlilService;
    }

    @PostMapping
    public Tahlil create(@RequestBody Tahlil tahlil) {
        return tahlilService.create(tahlil);
    }

    @GetMapping
    public List<Tahlil> getAll() {
        return tahlilService.getAll();
    }

    @GetMapping("/hasta/{hastaId}")
    public List<Tahlil> getByHasta(@PathVariable Long hastaId) {
        return tahlilService.getByHasta(hastaId);
    }

    @GetMapping("/doktor/{doktorId}")
    public List<Tahlil> getByDoktor(@PathVariable Long doktorId) {
        return tahlilService.getByDoktor(doktorId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tahlilService.delete(id);
    }
}