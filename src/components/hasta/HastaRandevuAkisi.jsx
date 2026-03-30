import React from "react";
import { HASTANELER } from "../../constants/hastaneler";
import { DOKTOR_HAVUZU } from "../../constants/doktorlar";
import { formatTarih } from "../../utils/helpers";

export default function HastaRandevuAkisi({
    randevuAdimi,
    hastaRandevuAkisi,
    randevuListesi,
    randevuOzeti,
    bulunanKonum,
    konumYukleniyor,
    seciliIl,
    seciliHastane,
    seciliDoktor,
    girisYapanKullanici,
    // sorgular
    poliklinigeGoreHastaneler,
    konumaSiraliHastaneler,
    hastaneyeGorePoliklinikler,
    hastanePoliklinigeGoreDoktorlar,
    musaitTarihler,
    tariheSaatler,
    randevuEngeliKontrol,
    // handler'lar
    geriGit,
    aramaTuruSec,
    ilSec,
    poliklinikSec,
    hastaneSec,
    doktorSec,
    slotSec,
    randevuAl,
    konumuTespitEt,
}) {
    if (randevuAdimi === "ana") {
        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-action-grid">
                    <button
                        className="mhrs-main-action-card hospital"
                        style={{ cursor: "pointer" }}
                        onClick={() => aramaTuruSec("poliklinik")}                    >
                        <div className="mhrs-main-action-icon">🏥</div>
                        <div>
                            <h3>Hastaneden Randevu Al</h3>
                            <p>Poliklinik veya konuma göre uygun hastane ve hekim seçin.</p>
                        </div>
                    </button>
                    <div className="mhrs-secondary-panel">
                        <h3>Yaklaşan Randevularım</h3>
                        <p>
                            {randevuListesi.length > 0
                                ? `${randevuListesi.length} adet randevu kaydınız görüntüleniyor.`
                                : "Yaklaşan randevunuz bulunmamaktadır."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (randevuAdimi === "arama-turu") {
        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Hastaneden Randevu Al</h3>
                </div>
                <div className="mhrs-choice-grid">
                    <button className="mhrs-choice-card poliklinik" onClick={() => aramaTuruSec("poliklinik")}>
                        <span className="mhrs-choice-icon">📋</span>
                        <span>Polikliniğe Göre</span>
                    </button>
                    <button className="mhrs-choice-card konum" onClick={() => aramaTuruSec("konum")}>
                        <span className="mhrs-choice-icon">📍</span>
                        <span>Konuma Göre</span>
                    </button>
                </div>
            </div>
        );
    }

    if (randevuAdimi === "konum-sec") {
        const hastaneler = bulunanKonum.il ? konumaSiraliHastaneler(bulunanKonum.il) : [];
        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Konum Seçiniz</h3>
                </div>
                <div className="mhrs-list-panel">
                    <div className="mhrs-inline-actions">
                        <button className="login-submit-btn" onClick={konumuTespitEt} disabled={konumYukleniyor}>
                            {konumYukleniyor ? "Konum Alınıyor..." : "📍 Mevcut Konumumu Kullan"}
                        </button>
                    </div>

                    {bulunanKonum.il && (
                        <>
                            <div className="status-indicator" style={{ marginBottom: 14 }}>
                                Mevcut konum: <b>{bulunanKonum.il} / {bulunanKonum.ilce}</b>
                                <br /><small>{bulunanKonum.detay}</small>
                            </div>
                            <div style={{ color: "#64748b", fontWeight: 600, marginBottom: 10 }}>
                                Konumunuza uygun hastaneler:
                            </div>
                            {hastaneler.length > 0 ? (
                                hastaneler.map((h) => (
                                    <button key={h.id} className="mhrs-hospital-card" onClick={() => hastaneSec(h.id)}>
                                        <div className="mhrs-hospital-header">
                                            <div><h4>{h.ad}</h4><p>{h.il} / {h.ilce}</p></div>
                                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                {h.enYakinMi && (
                                                    <span className="mhrs-small-badge" style={{ background: "#dcfce7", color: "#166534" }}>
                                                        ⭐ Size En Yakın
                                                    </span>
                                                )}
                                                {typeof h.mesafeKm === "number" && (
                                                    <span className="mhrs-small-badge">{h.mesafeKm} km</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="mhrs-empty-state">Bu konumda uygun hastane bulunamadı.</div>
                            )}
                            <div style={{ marginTop: 14 }}>
                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#64748b" }}>
                                    Farklı bir il seçmek isterseniz:
                                </label>
                                <select className="login-input" value={seciliIl} onChange={(e) => ilSec(e.target.value)}>
                                    <option value="">İl seçiniz</option>
                                    {HASTANELER.map((h) => h.il)
                                        .filter((v, i, arr) => arr.indexOf(v) === i)
                                        .map((il) => <option key={il} value={il}>{il}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (randevuAdimi === "poliklinik-sec") {
        const uygunPoliklinikler = hastaRandevuAkisi.hastaneId
            ? hastaneyeGorePoliklinikler(hastaRandevuAkisi.hastaneId)
            : Object.keys(DOKTOR_HAVUZU);

        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Poliklinik Seçiniz</h3>
                </div>
                <div className="mhrs-list-panel">
                    {uygunPoliklinikler.map((pol) => (
                        <button key={pol} className="mhrs-list-card" onClick={() => poliklinikSec(pol)}>
                            <div><h4>{pol}</h4><p>Bu alanda uygun hekimleri görüntüleyin.</p></div>
                            <span>›</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (randevuAdimi === "hastane-sec") {
        const uygunHastaneler =
            hastaRandevuAkisi.aramaTuru === "poliklinik"
                ? poliklinigeGoreHastaneler(hastaRandevuAkisi.poliklinik)
                : konumaSiraliHastaneler(hastaRandevuAkisi.il);

        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Hastane Seçiniz</h3>
                </div>
                <div className="mhrs-list-panel">
                    {uygunHastaneler.length > 0 ? (
                        uygunHastaneler.map((h) => (
                            <button key={h.id} className="mhrs-hospital-card" onClick={() => hastaneSec(h.id)}>
                                <div className="mhrs-hospital-header">
                                    <div>
                                        <h4>{h.ad}</h4>
                                        <p>{h.il}{h.ilce ? ` / ${h.ilce}` : ""}</p>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {h.enYakinMi && hastaRandevuAkisi.aramaTuru === "konum" && (
                                            <span className="mhrs-small-badge" style={{ background: "#dcfce7", color: "#166534" }}>
                                                ⭐ Size En Yakın
                                            </span>
                                        )}
                                        {typeof h.mesafeKm === "number" && (
                                            <span className="mhrs-small-badge">{h.mesafeKm} km</span>
                                        )}
                                    </div>
                                </div>
                                {hastaRandevuAkisi.aramaTuru === "poliklinik" && (
                                    <div className="mhrs-hospital-meta">
                                        <span>Poliklinik: {hastaRandevuAkisi.poliklinik}</span>
                                    </div>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="mhrs-empty-state">Seçtiğiniz kriterlere uygun hastane bulunamadı.</div>
                    )}
                </div>
            </div>
        );
    }

    if (randevuAdimi === "doktor-sec") {
        const doktorlar = (
            hastaRandevuAkisi.hastaneId && hastaRandevuAkisi.poliklinik
                ? hastanePoliklinigeGoreDoktorlar(hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik)
                : []
        ).map((d) => {
            const kontrol = randevuEngeliKontrol(Number(girisYapanKullanici?.id), Number(d.id));
            return { ...d, engelVar: kontrol?.engelVar || false, engelMesaji: kontrol?.mesaj || "" };
        });

        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Doktor Seçiniz</h3>
                </div>
                <div className="mhrs-list-panel">
                    {doktorlar.length > 0 ? (
                        doktorlar.map((d) => (
                            <button
                                key={d.id}
                                className="mhrs-doctor-card"
                                onClick={() => { if (d.engelVar) { alert(d.engelMesaji); return; } doktorSec(d.id); }}
                                disabled={d.engelVar}
                                style={d.engelVar ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                            >
                                <div className="mhrs-doctor-left">
                                    <div className="doc-avatar">👨‍⚕️</div>
                                    <div>
                                        <h4>{d.ad}</h4>
                                        <p>{d.unvan}</p>
                                        <small>{seciliHastane?.ad}</small>
                                        {d.engelVar && (
                                            <div style={{ marginTop: 6, color: "#dc2626", fontSize: "0.85rem", fontWeight: 600 }}>
                                                Bu doktordan şu an tekrar randevu alamazsınız
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mhrs-doctor-right">
                                    <span className="mhrs-small-badge">Uygun {d.uygunSlotSayisi}</span>
                                    {d.ilkMusaitSlot && <small>En yakın: {formatTarih(d.ilkMusaitSlot.tarih)}</small>}
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="mhrs-empty-state">Bu hastane ve poliklinikte müsait doktor bulunamadı.</div>
                    )}
                </div>
            </div>
        );
    }

    if (randevuAdimi === "slot-sec") {
        const tarihler = musaitTarihler(
            hastaRandevuAkisi.doktorId,
            hastaRandevuAkisi.hastaneId,
            hastaRandevuAkisi.poliklinik
        );

        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Randevu Saati Seçiniz</h3>
                </div>
                <div className="mhrs-list-panel">
                    {tarihler.map((tarih) => {
                        const saatler = tariheSaatler(
                            hastaRandevuAkisi.doktorId,
                            hastaRandevuAkisi.hastaneId,
                            hastaRandevuAkisi.poliklinik,
                            tarih
                        );
                        return (
                            <div key={tarih} className="mhrs-slot-group">
                                <div className="mhrs-slot-date">{formatTarih(tarih)}</div>
                                <div className="mhrs-slot-subtitle">
                                    {hastaRandevuAkisi.poliklinik} • {seciliDoktor?.ad}
                                </div>
                                <div className="mhrs-slot-grid">
                                    {saatler.map((slot) => (
                                        <button key={slot.id} className="mhrs-slot-btn" onClick={() => slotSec(slot.id)}>
                                            {slot.saat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (randevuAdimi === "onay" && randevuOzeti) {
        const engel = randevuEngeliKontrol(
            Number(girisYapanKullanici?.id),
            Number(randevuOzeti.doktor.id),
            randevuOzeti.slot.tarih
        );

        return (
            <div className="mhrs-flow-shell">
                <div className="mhrs-step-top">
                    <button className="mhrs-back-btn" onClick={geriGit}>←</button>
                    <h3>Randevuyu Onayla</h3>
                </div>
                <div className="mhrs-confirm-card">
                    <div className="mhrs-confirm-row"><span>Tarih</span><strong>{formatTarih(randevuOzeti.slot.tarih)}</strong></div>
                    <div className="mhrs-confirm-row"><span>Saat</span><strong>{randevuOzeti.slot.saat}</strong></div>
                    <div className="mhrs-confirm-divider" />
                    <div className="mhrs-confirm-block">
                        <p><b>Hastane:</b> {randevuOzeti.hastane.ad}</p>
                        <p><b>Poliklinik:</b> {randevuOzeti.poliklinik}</p>
                        <p><b>Doktor:</b> {randevuOzeti.doktor.ad}</p>
                        <p><b>Randevu Sahibi:</b> {girisYapanKullanici.adSoyad}</p>
                    </div>
                </div>

                {engel?.engelVar && (
                    <div style={{ marginTop: 14, padding: "12px 14px", background: "#fee2e2", color: "#991b1b", borderRadius: 10, fontWeight: 600 }}>
                        {engel.mesaj}
                    </div>
                )}

                <button
                    className="mhrs-confirm-btn"
                    onClick={randevuAl}
                    disabled={engel?.engelVar}
                    style={engel?.engelVar ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                >
                    Randevuyu Onayla
                </button>
            </div>
        );
    }

    return null;
}