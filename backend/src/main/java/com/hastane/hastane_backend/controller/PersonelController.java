package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Personel;
import com.hastane.hastane_backend.service.PersonelService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personeller")
public class PersonelController {

    private final PersonelService personelService;

    public PersonelController(PersonelService personelService) {
        this.personelService = personelService;
    }

    /*
     =========================================================
     🔥 ROLE-BASED GET
     =========================================================

     👑 ADMIN        → Tüm personelleri görür
     🏥 BASHEKIM     → Tüm personelleri görür
     👩‍💼 PERSONEL     → Sadece kendi profilini görür
     ❌ DOKTOR       → Yetkisiz
     ❌ HASTA        → Yetkisiz
    */
    @GetMapping
    public Object getPersoneller() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        rol = rol.replace("ROLE_", "");

        // ADMIN ve BASHEKIM tüm listeyi görür
        if (rol.equals("ADMIN") || rol.equals("BASHEKIM")) {
            return personelService.getAll();
        }

        // PERSONEL sadece kendi kaydını görür
        if (rol.equals("PERSONEL")) {
            return personelService.getMyPersonel(tcNo);
        }

        throw new RuntimeException("Bu role personel erişimi yok: " + rol);
    }

    /*
     =========================================================
     👑 SADECE ADMIN PERSONEL OLUŞTURABİLİR
     =========================================================
    */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Personel create(@RequestBody Personel personel) {
        return personelService.create(personel);
    }

    /*
     =========================================================
     👩‍💼 LOGIN OLAN PERSONELİN PROFİLİ
     =========================================================
    */
    @GetMapping("/me")
    @PreAuthorize("hasRole('PERSONEL')")
    public Personel getMe(Authentication authentication) {
        String tcNo = (String) authentication.getPrincipal();
        return personelService.getMyPersonel(tcNo);
    }

    /*
     =========================================================
     👑 SADECE ADMIN PERSONEL SİLEBİLİR
     =========================================================
    */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePersonel(@PathVariable Integer id) {
        personelService.deleteById(id);
    }
}