package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Yatis;
import com.hastane.hastane_backend.repository.YatisRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class YatisService {

    private final YatisRepository yatisRepository;

    public YatisService(YatisRepository yatisRepository) {
        this.yatisRepository = yatisRepository;
    }

    public Yatis admit(Yatis yatis) {
        yatis.setYatisTarihi(LocalDateTime.now());
        return yatisRepository.save(yatis);
    }

    public Yatis discharge(Long id) {
        Yatis yatis = yatisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yatış bulunamadı"));

        yatis.setTaburcuTarihi(LocalDateTime.now());
        return yatisRepository.save(yatis);
    }

    public List<Yatis> getAll() {
        return yatisRepository.findAll();
    }

    public List<Yatis> getByHasta(Long hastaId) {
        return yatisRepository.findByHastaId(hastaId);
    }

    public void delete(Long id) {
        yatisRepository.deleteById(id);
    }
}