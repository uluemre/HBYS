package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Tahlil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TahlilRepository extends JpaRepository<Tahlil, Long> {

    List<Tahlil> findByHastaId(Long hastaId);

    List<Tahlil> findByDoktorId(Long doktorId);
}