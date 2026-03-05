package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Doktor;
import com.hastane.hastane_backend.service.DoktorService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doktorlar")
public class DoktorController {

    private final DoktorService doktorService;

    public DoktorController(DoktorService doktorService) {
        this.doktorService = doktorService;
    }

    /*
     =========================================================
     🔥 ROLE-BASED GET ENDPOINT
     =========================================================

     👑 ADMIN      → Tüm doktorları görür
     🏥 BASHEKIM   → Tüm doktorları görür
     👨‍⚕️ DOKTOR     → Sadece kendi profilini görür
     ❌ HASTA      → Yetkisiz
     ❌ PERSONEL   → Yetkisiz

     Bu method veri seviyesinde rol kontrolü yapar.
    */
    @GetMapping
    public Object getDoktorlar() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // JWT filter principal olarak tcNo koyuyor
        String tcNo = (String) auth.getPrincipal();

        // Spring rolü ROLE_ADMIN gibi verir
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        rol = rol.replace("ROLE_", "");

        // 👑 ADMIN ve BASHEKIM tüm doktorları görebilir
        if (rol.equals("ADMIN") || rol.equals("BASHEKIM")) {
            return doktorService.getAll();
        }

        // 👨‍⚕️ DOKTOR sadece kendi kaydını görebilir
        if (rol.equals("DOKTOR")) {
            return doktorService.getMyDoktor(tcNo);
        }

        // Diğer roller engellenir
        throw new RuntimeException("Bu role doktorlara erişim yetkisi yok: " + rol);
    }

    /*
     =========================================================
     👑 SADECE ADMIN DOKTOR OLUŞTURABİLİR
     =========================================================

     Method-level security kullanıyoruz.
     SecurityConfig'ten bağımsız çalışır.
    */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Doktor create(@RequestBody Doktor doktor) {
        return doktorService.create(doktor);
    }

    /*
     =========================================================
     👨‍⚕️ LOGIN OLAN DOKTORUN PROFİLİ
     =========================================================

     /api/doktorlar/me

     Doktor kendi panelinde bunu kullanır.
    */
    @GetMapping("/me")
    @PreAuthorize("hasRole('DOKTOR')")
    public Doktor getMe(Authentication authentication) {

        String tcNo = (String) authentication.getPrincipal();

        return doktorService.getMyDoktor(tcNo);
    }

    /*
     =========================================================
     👑 SADECE ADMIN DOKTOR SİLEBİLİR
     =========================================================

     Gerçek hastane mantığı:
     - Başhekim doktor silemez
     - Doktor doktor silemez
     - Personel silemez
     - Hasta silemez

     Sadece ADMIN.
    */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoktor(@PathVariable Integer id) {
        doktorService.deleteById(id);
    }
}