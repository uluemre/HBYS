package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Doktor;
import com.hastane.hastane_backend.repository.DoktorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoktorService {

    private final DoktorRepository doktorRepository;

    public DoktorService(DoktorRepository doktorRepository) {
        this.doktorRepository = doktorRepository;
    }

    public List<Doktor> getAll() {
        return doktorRepository.findAll();
    }

    public Doktor create(Doktor doktor) {
        return doktorRepository.save(doktor);
    }

    public Doktor getMyDoktor(String tcNo) {
        return doktorRepository.findByKullanici_TcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Bu tc_no'ya bağlı doktor kaydı yok: " + tcNo));
    }

    public void deleteById(Integer id) {
        doktorRepository.deleteById(id);
    }

}