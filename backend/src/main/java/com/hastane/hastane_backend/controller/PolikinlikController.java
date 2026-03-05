package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Polikinlik;
import com.hastane.hastane_backend.service.PolikinlikService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polikinlikler")
public class PolikinlikController {

    private final PolikinlikService polikinlikService;

    public PolikinlikController(PolikinlikService polikinlikService) {
        this.polikinlikService = polikinlikService;
    }

    @PostMapping
    public Polikinlik create(@RequestBody Polikinlik polikinlik) {
        return polikinlikService.save(polikinlik);
    }

    @GetMapping
    public List<Polikinlik> getAll() {
        return polikinlikService.getAll();
    }

    @GetMapping("/{id}")
    public Polikinlik getById(@PathVariable Integer id) {
        return polikinlikService.getById(id);
    }
}