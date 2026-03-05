package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tahliller")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tahlil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hasta_id", nullable = false)
    private Long hastaId;

    @Column(name = "doktor_id", nullable = false)
    private Long doktorId;

    @Column(name = "tahlil_adi", length = 100, nullable = false)
    private String tahlilAdi;

    @Column(name = "sonuc_degeri", length = 50)
    private String sonucDegeri;

    @Column(name = "referans_araligi", length = 50)
    private String referansAraligi;

    @Column(name = "tarih")
    private LocalDateTime tarih;

    @Column(name = "randevu_id")
    private Long randevuId;
}