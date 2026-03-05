package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "sikayet_oneri")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SikayetOneri {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hasta_id", nullable = false)
    private Long hastaId;

    @Column(name = "kategori", length = 50)
    private String kategori;

    @Column(name = "mesaj", columnDefinition = "TEXT")
    private String mesaj;

    @Column(name = "oncelik_durumu", length = 20)
    private String oncelikDurumu;

    @Column(name = "tarih")
    private LocalDate tarih;

    @Column(name = "bashekim_cevabi", columnDefinition = "TEXT")
    private String bashekimCevabi;
}