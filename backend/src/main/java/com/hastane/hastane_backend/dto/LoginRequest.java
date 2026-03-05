package com.hastane.hastane_backend.dto;

public class LoginRequest {

    private String tcNo;
    private String sifre;

    public String getTcNo() { return tcNo; }
    public void setTcNo(String tcNo) { this.tcNo = tcNo; }

    public String getSifre() { return sifre; }
    public void setSifre(String sifre) { this.sifre = sifre; }
}
