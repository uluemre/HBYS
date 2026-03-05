package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otopark_sayac")
public class Otopark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "toplam_kapasite")
    private Integer toplamKapasite = 200;

    @Column(name = "mevcut_arac_sayisi")
    private Integer mevcutAracSayisi;

    @Column(name = "son_guncelleme")
    private LocalDateTime sonGuncelleme;

    // Getter ve Setter Metotları (Hataları silen kısım burası!)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getToplamKapasite() { return toplamKapasite; }
    public void setToplamKapasite(Integer toplamKapasite) { this.toplamKapasite = toplamKapasite; }

    public Integer getMevcutAracSayisi() { return mevcutAracSayisi; }
    public void setMevcutAracSayisi(Integer mevcutAracSayisi) { this.mevcutAracSayisi = mevcutAracSayisi; }

    public LocalDateTime getSonGuncelleme() { return sonGuncelleme; }
    public void setSonGuncelleme(LocalDateTime sonGuncelleme) { this.sonGuncelleme = sonGuncelleme; }
}