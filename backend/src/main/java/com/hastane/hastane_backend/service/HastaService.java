package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Hasta;
import com.hastane.hastane_backend.repository.HastaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HastaService {

    private final HastaRepository hastaRepository;

    public HastaService(HastaRepository hastaRepository) {
        this.hastaRepository = hastaRepository;
    }

    public Hasta save(Hasta hasta){
        return hastaRepository.save(hasta);
    }

    public Hasta findByTcNo(String tcNo){
        return hastaRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı: " + tcNo));
    }

    public List<Hasta> findAll(){
        return hastaRepository.findAll();
    }

    public void delete(Integer id){
        hastaRepository.deleteById(id);
    }
}