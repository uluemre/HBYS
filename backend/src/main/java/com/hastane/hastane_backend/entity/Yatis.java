package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "yatislar")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Yatis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hasta_id", nullable = false)
    private Long hastaId;

    @Column(name = "oda_no", length = 10, nullable = false)
    private String odaNo;

    @Column(name = "yatak_no", length = 10, nullable = false)
    private String yatakNo;

    @Column(name = "yatis_tarihi")
    private LocalDateTime yatisTarihi;

    @Column(name = "taburcu_tarihi")
    private LocalDateTime taburcuTarihi;

    @Column(name = "personel_id")
    private Long personelId;
}