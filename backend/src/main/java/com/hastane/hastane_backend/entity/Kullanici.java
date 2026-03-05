package com.hastane.hastane_backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "kullanicilar")
public class Kullanici {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tc_no", unique = true, nullable = false)
    private String tcNo;

    @JsonIgnore
    @Column(name = "sifre", nullable = false)
    private String sifre;

    // ✅ ENUM olarak rol
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTcNo() { return tcNo; }
    public void setTcNo(String tcNo) { this.tcNo = tcNo; }

    public String getSifre() { return sifre; }
    public void setSifre(String sifre) { this.sifre = sifre; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}