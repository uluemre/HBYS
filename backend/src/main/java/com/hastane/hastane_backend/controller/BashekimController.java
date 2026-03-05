package com.hastane.hastane_backend.controller;

import com.hastane.hastane_backend.dto.BashekimDashboardResponse;
import com.hastane.hastane_backend.repository.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bashekim")
public class BashekimController {

    private final DoktorRepository doktorRepository;
    private final HastaRepository hastaRepository;
    private final PersonelRepository personelRepository;
    private final TahlilRepository tahlilRepository;
    private final YatisRepository yatisRepository;

    public BashekimController(DoktorRepository doktorRepository,
                              HastaRepository hastaRepository,
                              PersonelRepository personelRepository,
                              TahlilRepository tahlilRepository,
                              YatisRepository yatisRepository) {

        this.doktorRepository = doktorRepository;
        this.hastaRepository = hastaRepository;
        this.personelRepository = personelRepository;
        this.tahlilRepository = tahlilRepository;
        this.yatisRepository = yatisRepository;
    }

    @GetMapping("/dashboard")
    public BashekimDashboardResponse getDashboard() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        rol = rol.replace("ROLE_", "");

        if (!rol.equals("BASHEKIM") && !rol.equals("ADMIN")) {
            throw new RuntimeException("Bu endpoint sadece BASHEKIM ve ADMIN içindir.");
        }

        return new BashekimDashboardResponse(
                doktorRepository.count(),
                hastaRepository.count(),
                personelRepository.count(),
                tahlilRepository.count(),
                yatisRepository.count()
        );
    }
}