package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.dto.LoginResponse;
import com.hastane.hastane_backend.dto.RegisterRequest;
import com.hastane.hastane_backend.entity.Hasta;
import com.hastane.hastane_backend.entity.Kullanici;
import com.hastane.hastane_backend.entity.Rol;
import com.hastane.hastane_backend.repository.KullaniciRepository;
import com.hastane.hastane_backend.repository.HastaRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class KullaniciService {

    private static final Logger log = LoggerFactory.getLogger(KullaniciService.class);

    private final KullaniciRepository kullaniciRepository;
    private final HastaRepository hastaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public KullaniciService(KullaniciRepository kullaniciRepository,
                            HastaRepository hastaRepository,
                            PasswordEncoder passwordEncoder,
                            JwtService jwtService) {
        this.kullaniciRepository = kullaniciRepository;
        this.hastaRepository = hastaRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(String tcNo, String sifre) {

        log.info("LOGIN attempt tcNo={}", tcNo);

        Kullanici kullanici = kullaniciRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(sifre, kullanici.getSifre())) {
            throw new RuntimeException("Şifre yanlış");
        }

        String token = jwtService.generateToken(
                kullanici.getTcNo(),
                kullanici.getRol()
        );

        return new LoginResponse(
                kullanici.getId(),
                kullanici.getTcNo(),
                kullanici.getRol().name(),
                token
        );
    }

    public Kullanici register(Kullanici kullanici, RegisterRequest request) {

        log.info("REGISTER attempt tcNo={}", kullanici.getTcNo());

        if (kullanici.getTcNo() == null || kullanici.getTcNo().isBlank()) {
            throw new RuntimeException("tcNo boş olamaz");
        }

        if (kullaniciRepository.findByTcNo(kullanici.getTcNo()).isPresent()) {
            throw new RuntimeException("Bu TC zaten kayıtlı");
        }

        kullanici.setRol(Rol.HASTA);
        kullanici.setSifre(passwordEncoder.encode(kullanici.getSifre()));

        Kullanici saved = kullaniciRepository.save(kullanici);

        // Hasta oluştur
        Hasta hasta = new Hasta();
        hasta.setTcNo(saved.getTcNo());
        hasta.setKullanici(saved);

        hasta.setAdSoyad(request.getAdSoyad());
        hasta.setTelefon(request.getTelefon());
        hasta.setAdres(request.getAdres());
        hasta.setCinsiyet(request.getCinsiyet());
        hasta.setKanGrubu(request.getKanGrubu());

        if (request.getDogumTarihi() != null) {
            hasta.setDogumTarihi(LocalDate.parse(request.getDogumTarihi()));
        }

        hastaRepository.save(hasta);

        log.info("HASTA profili oluşturuldu tcNo={}", saved.getTcNo());

        return saved;
    }

    public List<Kullanici> getAll() {
        return kullaniciRepository.findAll();
    }
}