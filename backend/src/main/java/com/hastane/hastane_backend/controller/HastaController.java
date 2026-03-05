package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.Hasta;
import com.hastane.hastane_backend.entity.Kullanici;
import com.hastane.hastane_backend.repository.HastaRepository;
import com.hastane.hastane_backend.repository.KullaniciRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hastalar")
public class HastaController {

    private final HastaRepository hastaRepository;
    private final KullaniciRepository kullaniciRepository;

    public HastaController(HastaRepository hastaRepository,
                           KullaniciRepository kullaniciRepository) {
        this.hastaRepository = hastaRepository;
        this.kullaniciRepository = kullaniciRepository;
    }

    // 🔥 AKILLI GET
    @GetMapping
    public Object getHastalar() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        rol = rol.replace("ROLE_", "");

        if (rol.equals("ADMIN") || rol.equals("BASHEKIM")) {
            return hastaRepository.findAll();
        }

        if (rol.equals("HASTA")) {
            return hastaRepository.findByTcNo(tcNo)
                    .orElseThrow(() -> new RuntimeException("Hasta bulunamadı: " + tcNo));
        }

        if (rol.equals("DOKTOR")) {
            return hastaRepository.findAll();
        }

        throw new RuntimeException("Bu role hastalara erişim yetkisi yok: " + rol);
    }

    // 🧑 HASTA kendi profilini oluşturur
    @PostMapping("/me")
    public Hasta createMyHasta(@RequestBody Hasta hasta) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        rol = rol.replace("ROLE_", "");

        if (!rol.equals("HASTA")) {
            throw new RuntimeException("Sadece HASTA rolü kendi profilini oluşturabilir.");
        }

        Kullanici kullanici = kullaniciRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + tcNo));

        hasta.setTcNo(tcNo);
        hasta.setKullanici(kullanici);

        return hastaRepository.save(hasta);
    }

    // 🧑 HASTA kendi profilini görür
    @GetMapping("/me")
    public Hasta getMyHasta() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();

        return hastaRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı: " + tcNo));
    }

    // 👑 SADECE ADMIN SİLEBİLİR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteHasta(@PathVariable Integer id) {
        hastaRepository.deleteById(id);
    }
}
