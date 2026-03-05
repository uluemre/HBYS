package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Yatis;
import com.hastane.hastane_backend.service.YatisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yatislar")
public class YatisController {

    private final YatisService yatisService;

    public YatisController(YatisService yatisService) {
        this.yatisService = yatisService;
    }

    // Hasta yatır
    @PostMapping
    public Yatis admit(@RequestBody Yatis yatis) {
        return yatisService.admit(yatis);
    }

    // Taburcu et
    @PutMapping("/taburcu/{id}")
    public Yatis discharge(@PathVariable Long id) {
        return yatisService.discharge(id);
    }

    @GetMapping
    public List<Yatis> getAll() {
        return yatisService.getAll();
    }

    @GetMapping("/hasta/{hastaId}")
    public List<Yatis> getByHasta(@PathVariable Long hastaId) {
        return yatisService.getByHasta(hastaId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        yatisService.delete(id);
    }
}