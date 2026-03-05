package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "poliklinikler")
public class Polikinlik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String ad;

    private Integer kat_bilgisi;

    private String aciklama;

    @OneToMany(mappedBy = "polikinlik")
    private List<Doktor> doktorlar;

    @OneToMany(mappedBy = "polikinlik")
    private List<Personel> personeller;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getAd() { return ad; }
    public void setAd(String ad) { this.ad = ad; }

    public Integer getKat_bilgisi() { return kat_bilgisi; }
    public void setKat(Integer kat) { this.kat_bilgisi = kat; }

    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }

    public List<Doktor> getDoktorlar() { return doktorlar; }
    public void setDoktorlar(List<Doktor> doktorlar) { this.doktorlar = doktorlar; }

    public List<Personel> getPersoneller() { return personeller; }
    public void setPersoneller(List<Personel> personeller) { this.personeller = personeller; }
}