import React from "react";
import { BASHEKIM_DEMO_SIKAYETLERI } from "../../constants/hastaneler";
import { formatTarih } from "../../utils/helpers";
import { haftaBaslangici, haftaBitisi, ayBaslangici, ayBitisi, tarihAraliktaMi } from "../../hooks/useDoktorTakvim";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function BashekimDashboard({
    adSoyad,
    sistemOzeti,
    performanslar,
    setAktifSekme,
}) {
    return (
        <div className="table-container">
            <div className="mhrs-banner" style={{ marginBottom: 16 }}>
                Hoş Geldiniz Başhekim {adSoyad}
            </div>

            <div className="mhrs-action-grid" style={{ marginBottom: 20 }}>
                {[
                    { baslik: "Bugünkü Randevular", deger: `${sistemOzeti.bugunkuRandevu} adet` },
                    { baslik: "Açık Şikayet", deger: `${sistemOzeti.acikSikayet} adet` },
                    { baslik: "Aktif Doktor", deger: `${sistemOzeti.aktifDoktorSayisi} kişi` },
                    { baslik: "Toplam Randevu", deger: `${sistemOzeti.toplamHastaRandevu} kayıt` },
                ].map(({ baslik, deger }) => (
                    <div key={baslik} className="mhrs-secondary-panel">
                        <h3>{baslik}</h3><p>{deger}</p>
                    </div>
                ))}
            </div>

            <div className="mhrs-choice-grid" style={{ marginBottom: 20 }}>
                <button className="mhrs-choice-card poliklinik" onClick={() => setAktifSekme("Başhekim Profili")}><span className="mhrs-choice-icon">👤</span><span>Başhekim Profili</span></button>
                <button className="mhrs-choice-card konum" onClick={() => setAktifSekme("Şikayet/Öneri Yönetimi")}><span className="mhrs-choice-icon">📝</span><span>Şikayet / Öneri</span></button>
                <button className="mhrs-choice-card poliklinik" onClick={() => setAktifSekme("Nöbet ve Çalışma Çizelgesi")}><span className="mhrs-choice-icon">🗓️</span><span>Nöbet Çizelgesi</span></button>
                <button className="mhrs-choice-card konum" onClick={() => setAktifSekme("Performans Analizi")}><span className="mhrs-choice-icon">📊</span><span>Performans Analizi</span></button>
            </div>

            <div className="table-header" style={{ marginBottom: 14 }}>
                <h3>Hızlı Yönetim Özeti</h3>
            </div>
            <table className="modern-table">
                <thead><tr><th>Doktor</th><th>Poliklinik</th><th>Hasta Sayısı</th><th>Aktif Slot</th></tr></thead>
                <tbody>
                    {performanslar.slice(0, 6).map((item) => (
                        <tr key={item.doktorId}>
                            <td>{item.doktor}</td>
                            <td>{item.poliklinik}</td>
                            <td>{item.hastaSayisi}</td>
                            <td>{item.aktifSlotSayisi}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Şikayetler ───────────────────────────────────────────────────────────────
export function BashekimSikayetleri() {
    return (
        <div className="table-container">
            <div className="table-header" style={{ marginBottom: 20 }}>
                <h3>📝 Hasta Şikayet ve Önerileri</h3>
            </div>
            <table className="modern-table">
                <thead><tr><th>Hasta</th><th>Konu</th><th>Birim</th><th>Tarih</th><th>Durum</th><th>Mesaj</th></tr></thead>
                <tbody>
                    {BASHEKIM_DEMO_SIKAYETLERI.map((item) => (
                        <tr key={item.id}>
                            <td>{item.hasta}</td>
                            <td>{item.konu}</td>
                            <td>{item.birim}</td>
                            <td>{formatTarih(item.tarih)}</td>
                            <td>
                                <span className={`status-badge ${item.durum === "Çözüldü" ? "status-active" :
                                    item.durum === "İnceleniyor" ? "status-pending" : "status-inactive"
                                    }`}>{item.durum}</span>
                            </td>
                            <td>{item.mesaj}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Nöbetler ─────────────────────────────────────────────────────────────────
export function BashekimNobetleri({
    bashekimCalismaOzeti,
    nobetListesi,
    onNobetAta,
    onOtomatikNobetOnerisi,
}) {
    return (
        <div className="table-container">
            <div className="table-header" style={{ marginBottom: 20 }}>
                <h3>🗓️ Nöbet ve Çalışma Çizelgesi</h3>
            </div>

            <div className="mhrs-action-grid" style={{ marginBottom: 20 }}>
                {[
                    { baslik: "Eksik Çalışan Doktor", deger: `${bashekimCalismaOzeti.filter((d) => d.eksikSaat > 0).length} kişi` },
                    { baslik: "Yeterli Çalışan Doktor", deger: `${bashekimCalismaOzeti.filter((d) => d.durum === "Yeterli").length} kişi` },
                    { baslik: "Toplam Nöbet", deger: `${nobetListesi.length} kayıt` },
                ].map(({ baslik, deger }) => (
                    <div key={baslik} className="mhrs-secondary-panel">
                        <h3>{baslik}</h3><p>{deger}</p>
                    </div>
                ))}
                <div className="mhrs-secondary-panel">
                    <h3>Otomatik Öneri</h3>
                    <button className="login-submit-btn" style={{ marginTop: 10, width: "auto", padding: "10px 16px" }} onClick={onOtomatikNobetOnerisi}>
                        Nöbet Listesi Oluştur
                    </button>
                </div>
            </div>

            <h4 style={{ marginBottom: 12 }}>Doktor Haftalık Çalışma Durumu</h4>
            <table className="modern-table" style={{ marginBottom: 24 }}>
                <thead>
                    <tr><th>Doktor</th><th>Poliklinik</th><th>Hedef Saat</th><th>Toplam Saat</th><th>Eksik Saat</th><th>Durum</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                    {bashekimCalismaOzeti.map((item) => (
                        <tr key={item.doktorId}>
                            <td>{item.doktor}</td>
                            <td>{item.poliklinik}</td>
                            <td>{item.hedefSaat}</td>
                            <td>{item.toplamSaat}</td>
                            <td>{item.eksikSaat}</td>
                            <td>
                                <span className={`status-badge ${item.durum === "Eksik" ? "status-inactive" :
                                    item.durum === "Yeterli" ? "status-active" : "status-pending"
                                    }`}>{item.durum}</span>
                            </td>
                            <td>
                                <button onClick={() => onNobetAta(item)} style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
                                    Nöbet Ata
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4 style={{ marginBottom: 12 }}>Oluşturulan Nöbet Listesi</h4>
            <table className="modern-table">
                <thead><tr><th>Doktor</th><th>Poliklinik</th><th>Tarih</th><th>Saat</th><th>Durum</th></tr></thead>
                <tbody>
                    {nobetListesi.map((item) => (
                        <tr key={item.id}>
                            <td>{item.doktor}</td>
                            <td>{item.poliklinik}</td>
                            <td>{formatTarih(item.tarih)}</td>
                            <td>{item.saat}</td>
                            <td>
                                <span className={`status-badge ${item.durum === "Onaylı" ? "status-active" : "status-pending"}`}>{item.durum}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Performans Analizi ───────────────────────────────────────────────────────
export function BashekimPerformansAnalizi({
    performanslar,
    poliklinikOzeti,
    sistemOzeti,
    filtreTipi, setFiltreTipi,
    referansTarih, setReferansTarih,
    baslangicTarih, setBaslangicTarih,
    bitisTarih, setBitisTarih,
}) {
    const aralik = (() => {
        if (filtreTipi === "gunluk") return { bas: referansTarih, bit: referansTarih };
        if (filtreTipi === "haftalik") return { bas: haftaBaslangici(referansTarih), bit: haftaBitisi(referansTarih) };
        if (filtreTipi === "aylik") return { bas: ayBaslangici(referansTarih), bit: ayBitisi(referansTarih) };
        return { bas: baslangicTarih, bit: bitisTarih };
    })();

    return (
        <div className="table-container">
            <div className="table-header" style={{ marginBottom: 20 }}>
                <h3>📊 Doktor Performans Analizi</h3>
            </div>

            {/* Filtre */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 20, padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 }}>
                <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Görünüm Tipi</label>
                    <select className="login-input" value={filtreTipi} onChange={(e) => setFiltreTipi(e.target.value)}>
                        <option value="gunluk">Günlük</option>
                        <option value="haftalik">Haftalık</option>
                        <option value="aylik">Aylık</option>
                        <option value="aralik">Tarih Aralığı</option>
                    </select>
                </div>
                {filtreTipi !== "aralik" ? (
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Referans Tarihi</label>
                        <input type="date" className="login-input" value={referansTarih} onChange={(e) => setReferansTarih(e.target.value)} />
                    </div>
                ) : (
                    <>
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Başlangıç</label>
                            <input type="date" className="login-input" value={baslangicTarih} onChange={(e) => setBaslangicTarih(e.target.value)} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Bitiş</label>
                            <input type="date" className="login-input" value={bitisTarih} onChange={(e) => setBitisTarih(e.target.value)} />
                        </div>
                    </>
                )}
                <div style={{ display: "flex", alignItems: "end", fontWeight: 700, color: "#0f172a" }}>
                    Aralık: {formatTarih(aralik.bas)} - {formatTarih(aralik.bit)}
                </div>
            </div>

            <div className="mhrs-action-grid" style={{ marginBottom: 20 }}>
                {[
                    { baslik: "En Aktif Doktor", deger: performanslar[0]?.doktor || "Veri yok" },
                    { baslik: "En Yüksek Saat", deger: `${performanslar[0]?.toplamSaat || 0} saat` },
                    { baslik: "Toplam Hekim", deger: `${sistemOzeti.toplamHekim}` },
                    { baslik: "Toplam Randevu", deger: `${performanslar.reduce((t, i) => t + i.hastaSayisi, 0)}` },
                ].map(({ baslik, deger }) => (
                    <div key={baslik} className="mhrs-secondary-panel"><h3>{baslik}</h3><p>{deger}</p></div>
                ))}
            </div>

            <h4 style={{ marginBottom: 12 }}>Doktor Bazlı Performans</h4>
            <table className="modern-table" style={{ marginBottom: 24 }}>
                <thead>
                    <tr><th>Doktor</th><th>Poliklinik</th><th>Toplam Saat</th><th>Aktif Gün</th><th>Randevu</th><th>Tamamlanan</th><th>Nöbet</th><th>Doluluk %</th><th>Skor</th></tr>
                </thead>
                <tbody>
                    {performanslar.map((item) => (
                        <tr key={item.doktorId}>
                            <td>{item.doktor}</td>
                            <td>{item.poliklinik}</td>
                            <td>{item.toplamSaat}</td>
                            <td>{item.aktifGunSayisi}</td>
                            <td>{item.hastaSayisi}</td>
                            <td>{item.tamamlananMuayeneSayisi}</td>
                            <td>{item.nobetSayisi}</td>
                            <td>{item.dolulukOrani}%</td>
                            <td>{item.dolulukPuani}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4 style={{ marginBottom: 12 }}>Poliklinik Yoğunluk Özeti</h4>
            <table className="modern-table">
                <thead><tr><th>Poliklinik</th><th>Randevu Sayısı</th><th>Müsait Slot</th><th>Yoğunluk</th></tr></thead>
                <tbody>
                    {poliklinikOzeti.map((item) => (
                        <tr key={item.poliklinik}>
                            <td>{item.poliklinik}</td>
                            <td>{item.randevuSayisi}</td>
                            <td>{item.musaitSlot}</td>
                            <td>
                                <span className={`status-badge ${item.seviye === "Yoğun" ? "status-inactive" :
                                    item.seviye === "Orta" ? "status-pending" : "status-active"
                                    }`}>{item.seviye}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}