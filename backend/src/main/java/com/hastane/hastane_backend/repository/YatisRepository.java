package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Yatis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YatisRepository extends JpaRepository<Yatis, Long> {

    List<Yatis> findByHastaId(Long hastaId);

    List<Yatis> findByPersonelId(Long personelId);
}