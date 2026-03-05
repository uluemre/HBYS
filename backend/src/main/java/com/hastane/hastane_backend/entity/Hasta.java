package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "hastalar")
public class Hasta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tc_no")
    private String tcNo;

    @Column(name = "ad_soyad")
    private String adSoyad;

    @Column(name = "dogum_tarihi")
    private LocalDate dogumTarihi;

    @Column(name = "cinsiyet")
    private String cinsiyet;

    @Column(name = "kan_grubu")
    private String kanGrubu;

    @Column(name = "telefon")
    private String telefon;

    @Column(name = "adres")
    private String adres;

    // 🔥 RECURSION KESİLDİ
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "kullanici_id")
    private Kullanici kullanici;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTcNo() { return tcNo; }
    public void setTcNo(String tcNo) { this.tcNo = tcNo; }

    public String getAdSoyad() { return adSoyad; }
    public void setAdSoyad(String adSoyad) { this.adSoyad = adSoyad; }

    public LocalDate getDogumTarihi() { return dogumTarihi; }
    public void setDogumTarihi(LocalDate dogumTarihi) { this.dogumTarihi = dogumTarihi; }

    public String getCinsiyet() { return cinsiyet; }
    public void setCinsiyet(String cinsiyet) { this.cinsiyet = cinsiyet; }

    public String getKanGrubu() { return kanGrubu; }
    public void setKanGrubu(String kanGrubu) { this.kanGrubu = kanGrubu; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public Kullanici getKullanici() { return kullanici; }
    public void setKullanici(Kullanici kullanici) { this.kullanici = kullanici; }
}