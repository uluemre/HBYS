package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Personel;
import com.hastane.hastane_backend.entity.Kullanici;
import com.hastane.hastane_backend.repository.PersonelRepository;
import com.hastane.hastane_backend.repository.KullaniciRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class PersonelService {

    private final PersonelRepository personelRepository;
    private final KullaniciRepository kullaniciRepository;

    public PersonelService(PersonelRepository personelRepository, KullaniciRepository kullaniciRepository) {
        this.personelRepository = personelRepository;
        this.kullaniciRepository = kullaniciRepository;
    }

    public List<Personel> getAll() {
        return personelRepository.findAll();
    }

    public Personel create(Personel personel) {
        return personelRepository.save(personel);
    }

    public Personel getMyPersonel(String tcNo) {

        Kullanici kullanici = kullaniciRepository.findByTcNo(tcNo)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + tcNo));

        // Şimdilik: personelRepository'de findByKullanici_Id varsa onunla buluyoruz
        return personelRepository.findByKullanici_Id(kullanici.getId())
                .orElseThrow(() -> new RuntimeException("Bu kullanıcıya bağlı personel kaydı yok (kullanici_id=" + kullanici.getId() + ")"));
    }
    public void deleteById(Integer id) {
        personelRepository.deleteById(id);
    }
}