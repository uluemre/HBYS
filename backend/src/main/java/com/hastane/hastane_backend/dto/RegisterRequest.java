package com.hastane.hastane_backend.dto;

public class RegisterRequest {

    private String tc_no;
    private String sifre;
    private String adSoyad;
    private String rol;
    private String cinsiyet;
    private String kanGrubu;
    private String telefon;
    private String adres;
    private String dogumTarihi;

    public String getTcNo() { return tc_no; }
    public void setTcNo(String tcNo) { this.tc_no = tcNo; }

    public String getTc_no() { return tc_no; }
    public void setTc_no(String tc_no) { this.tc_no = tc_no; }

    public String getSifre() { return sifre; }
    public void setSifre(String sifre) { this.sifre = sifre; }

    public String getAdSoyad() { return adSoyad; }
    public void setAdSoyad(String adSoyad) { this.adSoyad = adSoyad; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getCinsiyet() { return cinsiyet; }
    public void setCinsiyet(String cinsiyet) { this.cinsiyet = cinsiyet; }

    public String getKanGrubu() { return kanGrubu; }
    public void setKanGrubu(String kanGrubu) { this.kanGrubu = kanGrubu; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public String getDogumTarihi() { return dogumTarihi; }
    public void setDogumTarihi(String dogumTarihi) { this.dogumTarihi = dogumTarihi; }
}