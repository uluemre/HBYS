package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "doktorlar")
public class Doktor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ad_soyad")
    private String adSoyad;

    @Column(name = "uzmanlik_alani")
    private String uzmanlikAlani;

    @Column(name = "unvan")
    private String unvan;

    // 🔥 RECURSION KESİLDİ
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "kullanici_id")
    private Kullanici kullanici;

    // 🔥 RECURSION KESİLDİ
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "poliklinik_id")
    private Polikinlik polikinlik;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getAdSoyad() { return adSoyad; }
    public void setAdSoyad(String adSoyad) { this.adSoyad = adSoyad; }

    public String getUzmanlikAlani() { return uzmanlikAlani; }
    public void setUzmanlikAlani(String uzmanlikAlani) { this.uzmanlikAlani = uzmanlikAlani; }

    public String getUnvan() { return unvan; }
    public void setUnvan(String unvan) { this.unvan = unvan; }

    public Kullanici getKullanici() { return kullanici; }
    public void setKullanici(Kullanici kullanici) { this.kullanici = kullanici; }

    public Polikinlik getPolikinlik() { return polikinlik; }
    public void setPolikinlik(Polikinlik polikinlik) { this.polikinlik = polikinlik; }
}