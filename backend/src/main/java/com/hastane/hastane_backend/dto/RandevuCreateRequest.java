package com.hastane.hastane_backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RandevuCreateRequest {

    private Integer doktorId;
    private LocalDate randevuTarihi;
    private LocalTime randevuSaati;
    private String sikayet;

    public Integer getDoktorId() {
        return doktorId;
    }

    public void setDoktorId(Integer doktorId) {
        this.doktorId = doktorId;
    }

    public LocalDate getRandevuTarihi() {
        return randevuTarihi;
    }

    public void setRandevuTarihi(LocalDate randevuTarihi) {
        this.randevuTarihi = randevuTarihi;
    }

    public LocalTime getRandevuSaati() {
        return randevuSaati;
    }

    public void setRandevuSaati(LocalTime randevuSaati) {
        this.randevuSaati = randevuSaati;
    }

    public String getSikayet() {
        return sikayet;
    }

    public void setSikayet(String sikayet) {
        this.sikayet = sikayet;
    }
}