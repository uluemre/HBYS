package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.entity.*;
import com.hastane.hastane_backend.response.ApiResponse;
import com.hastane.hastane_backend.service.RandevuService;
import com.hastane.hastane_backend.repository.*;
import com.hastane.hastane_backend.dto.RandevuCreateRequest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/randevular")
public class RandevuController {

    private final RandevuService randevuService;
    private final HastaRepository hastaRepository;

    public RandevuController(RandevuService randevuService,
                             HastaRepository hastaRepository) {
        this.randevuService = randevuService;
        this.hastaRepository = hastaRepository;
    }

    /*
     =========================================================
     🧑 HASTA RANDEVU OLUŞTURUR
     =========================================================
    */
    @PostMapping
    @PreAuthorize("hasRole('HASTA')")
    public ApiResponse<Randevu> create(@RequestBody RandevuCreateRequest request) {

        // 🔎 DEBUG LOG
        System.out.println("===== RANDEVU REQUEST =====");
        System.out.println("DoktorId: " + request.getDoktorId());
        System.out.println("Tarih: " + request.getRandevuTarihi());
        System.out.println("Saat: " + request.getRandevuSaati());
        System.out.println("===========================");

        // 🔥 NULL KONTROLLERİ
        if (request.getDoktorId() == null) {
            throw new RuntimeException("Doktor ID boş olamaz");
        }

        if (request.getRandevuTarihi() == null || request.getRandevuSaati() == null) {
            throw new RuntimeException("Tarih ve saat boş olamaz");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();

        Hasta hasta = hastaRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Hasta kaydı yok"));

        Randevu randevu = new Randevu();
        randevu.setRandevuTarihi(request.getRandevuTarihi());
        randevu.setRandevuSaati(request.getRandevuSaati());
        randevu.setSikayet(request.getSikayet());

        Randevu created = randevuService.create(
                hasta.getId(),
                request.getDoktorId(),
                randevu
        );

        return new ApiResponse<>(true, "Randevu oluşturuldu", created);
    }

    /*
     =========================================================
     🧑 HASTA KENDİ RANDEVULARINI GÖRÜR
     =========================================================
    */
    @GetMapping("/me")
    @PreAuthorize("hasRole('HASTA')")
    public ApiResponse<List<Randevu>> getMyRandevular() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String tcNo = (String) auth.getPrincipal();

        Hasta hasta = hastaRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));

        return new ApiResponse<>(
                true,
                "Hastanın randevuları",
                randevuService.getByHasta(hasta.getId())
        );
    }
}