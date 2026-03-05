package com.hastane.hastane_backend.repository;

import com.hastane.hastane_backend.entity.Otopark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtoparkRepository extends JpaRepository<Otopark, Long> {
}