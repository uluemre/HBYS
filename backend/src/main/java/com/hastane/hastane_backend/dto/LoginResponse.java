package com.hastane.hastane_backend.dto;

public class LoginResponse {

    private Integer id;
    private String tcNo;
    private String rol;   // JWT için string dönüyoruz
    private String token;

    public LoginResponse(Integer id, String tcNo, String rol, String token) {
        this.id = id;
        this.tcNo = tcNo;
        this.rol = rol;
        this.token = token;
    }

    public Integer getId() { return id; }
    public String getTcNo() { return tcNo; }
    public String getRol() { return rol; }
    public String getToken() { return token; }
}