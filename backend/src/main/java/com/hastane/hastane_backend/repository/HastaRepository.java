package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Hasta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HastaRepository extends JpaRepository<Hasta, Integer> {

    Optional<Hasta> findByTcNo(String tcNo);

}