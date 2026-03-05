package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "randevular")
public class Randevu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Hasta ilişkisi
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hasta_id")
    private Hasta hasta;

    // Doktor ilişkisi
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "doktor_id")
    private Doktor doktor;

    // DATE kolonuna karşılık
    @Column(name = "randevu_tarihi")
    private LocalDate randevuTarihi;

    // TIME kolonuna karşılık
    @Column(name = "randevu_saati")
    private LocalTime randevuSaati;

    // DB'de varchar(20)
    @Enumerated(EnumType.STRING)
    @Column(name = "durum")
    private RandevuDurum durum;

    // DB'de text
    @Column(name = "sikayet")
    private String sikayet;

    // ---- Getter Setter ----

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Hasta getHasta() { return hasta; }
    public void setHasta(Hasta hasta) { this.hasta = hasta; }

    public Doktor getDoktor() { return doktor; }
    public void setDoktor(Doktor doktor) { this.doktor = doktor; }

    public LocalDate getRandevuTarihi() { return randevuTarihi; }
    public void setRandevuTarihi(LocalDate randevuTarihi) { this.randevuTarihi = randevuTarihi; }

    public LocalTime getRandevuSaati() { return randevuSaati; }
    public void setRandevuSaati(LocalTime randevuSaati) { this.randevuSaati = randevuSaati; }

    public RandevuDurum getDurum() { return durum; }
    public void setDurum(RandevuDurum durum) { this.durum = durum; }

    public String getSikayet() { return sikayet; }
    public void setSikayet(String sikayet) { this.sikayet = sikayet; }
}