package com.hastane.hastane_backend.dto;

public class BashekimDashboardResponse {

    private long toplamDoktor;
    private long toplamHasta;
    private long toplamPersonel;
    private long toplamTahlil;
    private long toplamYatis;

    public BashekimDashboardResponse(long toplamDoktor,
                                     long toplamHasta,
                                     long toplamPersonel,
                                     long toplamTahlil,
                                     long toplamYatis) {
        this.toplamDoktor = toplamDoktor;
        this.toplamHasta = toplamHasta;
        this.toplamPersonel = toplamPersonel;
        this.toplamTahlil = toplamTahlil;
        this.toplamYatis = toplamYatis;
    }

    public long getToplamDoktor() { return toplamDoktor; }
    public long getToplamHasta() { return toplamHasta; }
    public long getToplamPersonel() { return toplamPersonel; }
    public long getToplamTahlil() { return toplamTahlil; }
    public long getToplamYatis() { return toplamYatis; }
}