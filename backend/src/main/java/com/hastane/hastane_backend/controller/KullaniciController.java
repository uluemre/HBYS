package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.dto.LoginRequest;
import com.hastane.hastane_backend.dto.LoginResponse;
import com.hastane.hastane_backend.dto.RegisterRequest;
import com.hastane.hastane_backend.entity.Kullanici;
import com.hastane.hastane_backend.entity.Rol;
import com.hastane.hastane_backend.response.ApiResponse;
import com.hastane.hastane_backend.service.KullaniciService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class KullaniciController {

    private final KullaniciService kullaniciService;

    public KullaniciController(KullaniciService kullaniciService) {
        this.kullaniciService = kullaniciService;
    }

    /*
     =========================================================
     REGISTER
     =========================================================
    */
    @PostMapping("/register")
    public ApiResponse<Kullanici> register(@RequestBody RegisterRequest request) {

        Kullanici kullanici = new Kullanici();
        kullanici.setTcNo(request.getTcNo());
        kullanici.setSifre(request.getSifre());

        Rol rol = request.getRol() != null
                ? Rol.valueOf(request.getRol())
                : Rol.HASTA;

        kullanici.setRol(rol);

        Kullanici kaydedilen = kullaniciService.register(kullanici, request);

        return new ApiResponse<>(
                true,
                "Kayıt başarılı",
                kaydedilen
        );
    }

    /*
     =========================================================
     LOGIN
     =========================================================
    */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {

        return new ApiResponse<>(
                true,
                "Giriş başarılı",
                kullaniciService.login(request.getTcNo(), request.getSifre())
        );
    }

    /*
     =========================================================
     TEST
     =========================================================
    */
    @GetMapping
    public ApiResponse<List<Kullanici>> getAll() {

        return new ApiResponse<>(
                true,
                "Kullanıcılar listelendi",
                kullaniciService.getAll()
        );
    }
}