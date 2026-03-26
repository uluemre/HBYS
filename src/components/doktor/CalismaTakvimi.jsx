import React from "react";
import { HASTANELER, SAAT_SECENEKLERI } from "../../constants/hastaneler";
import { formatTarih } from "../../utils/helpers";

const MIN_MUAYENE = 1000;
const MAX_MUAYENE = 3000;

export default function CalismaTakvimi({
    aktifDoktorDemoKaydi,
    randevuSlotlari,
    doktorTakvimFormu,
    setDoktorTakvimFormu,
    doktorHaftalikPlanlari,
    setDoktorHaftalikPlanlari,
    haftalikOzet,
    muayeneUcreti,
    muayeneUcretiInput,
    setMuayeneUcretiInput,
    ucretGuncelleniyor,
    onUcretGuncelle,
    onSlotEkle,
    onSlotSil,
    onHaftalikHedefKaydet,
    saatSeciminiDegistir,
    VARSAYILAN_HEDEF,
    MIN_HAFTALIK,
    MAX_HAFTALIK,
    slotSirala,
}) {
    const formatTL = (v) =>
        v != null && v !== "" ? `${Number(v).toLocaleString("tr-TR")} TL` : "Belirlenmedi";

    return (
        <div className="table-container">
            <div className="table-header" style={{ marginBottom: 20 }}>
                <h3>🗓️ Çalışma Takvimi Yönetimi</h3>
                <p style={{ color: "#64748b", marginTop: 8 }}>
                    Hastane, gün ve saat seçerek kendi uygunluk planınızı oluşturun.
                </p>
            </div>

            {/* Muayene Ücreti */}
            <div style={{ marginBottom: 16, padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                    Muayene Ücreti: {formatTL(muayeneUcreti)}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: 8 }}>
                    Ücret aralığı: {MIN_MUAYENE} TL - {MAX_MUAYENE} TL
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                        type="number"
                        min={MIN_MUAYENE}
                        max={MAX_MUAYENE}
                        step="50"
                        value={muayeneUcretiInput}
                        onChange={(e) => setMuayeneUcretiInput(e.target.value)}
                        placeholder="Muayene ücreti giriniz"
                        className="login-input"
                        style={{ maxWidth: 220 }}
                    />
                    <button
                        className="login-submit-btn"
                        onClick={onUcretGuncelle}
                        disabled={ucretGuncelleniyor}
                        style={{ width: "auto", padding: "10px 18px" }}
                    >
                        {ucretGuncelleniyor ? "Kaydediliyor..." : "Ücreti Kaydet"}
                    </button>
                </div>
            </div>

            {!aktifDoktorDemoKaydi ? (
                <div className="mhrs-empty-state">
                    Doktor kaydınız demo hekim listesiyle eşleşmediği için takvim ekranı açılamadı.
                </div>
            ) : (
                <>
                    {/* Doktor özet */}
                    <div className="schedule-summary-card">
                        <h4>{aktifDoktorDemoKaydi.ad}</h4>
                        <p>{aktifDoktorDemoKaydi.unvan} • {aktifDoktorDemoKaydi.poliklinik}</p>
                    </div>

                    {/* Haftalık hedef */}
                    <div style={{ marginBottom: 20, padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, alignItems: "end" }}>
                            <div>
                                <label className="schedule-label">Haftalık Hedef Saat</label>
                                <input
                                    type="number"
                                    min={MIN_HAFTALIK}
                                    max={MAX_HAFTALIK}
                                    className="login-input"
                                    value={doktorHaftalikPlanlari[aktifDoktorDemoKaydi.id]?.hedefSaat || VARSAYILAN_HEDEF}
                                    onChange={(e) =>
                                        setDoktorHaftalikPlanlari((prev) => ({
                                            ...prev,
                                            [aktifDoktorDemoKaydi.id]: { ...(prev[aktifDoktorDemoKaydi.id] || {}), hedefSaat: e.target.value },
                                        }))
                                    }
                                />
                                <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: 6 }}>
                                    Sınır: {MIN_HAFTALIK}-{MAX_HAFTALIK} saat
                                </div>
                                <button
                                    className="login-submit-btn"
                                    style={{ marginTop: 10, width: "auto", padding: "10px 16px" }}
                                    onClick={onHaftalikHedefKaydet}
                                >
                                    Haftalık Hedefi Kaydet
                                </button>
                            </div>

                            {[
                                { label: "Hafta Aralığı", value: haftalikOzet ? `${formatTarih(haftalikOzet.haftaBaslangic)} - ${formatTarih(haftalikOzet.haftaBitis)}` : "-" },
                                { label: "Doldurulan Saat", value: `${haftalikOzet?.mevcutSaat || 0} saat` },
                                { label: "Kalan Saat", value: `${haftalikOzet?.kalanSaat || 0} saat` },
                                { label: "Seçili Ek Saat", value: `${haftalikOzet?.seciliEkSaat || 0} saat` },
                            ].map(({ label, value }) => (
                                <div key={label} className="mhrs-secondary-panel">
                                    <h3>{label}</h3><p>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Doluluk çubuğu */}
                        <div style={{ marginTop: 14 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8 }}>Haftalık Doluluk</div>
                            <div style={{ width: "100%", height: 14, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${Math.min(((haftalikOzet?.mevcutSaat || 0) / (haftalikOzet?.hedefSaat || VARSAYILAN_HEDEF)) * 100, 100)}%`,
                                        height: "100%",
                                        background: haftalikOzet?.fazlaMi ? "#f59e0b" : haftalikOzet?.yeterliMi ? "#22c55e" : "#3b82f6",
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: 8, fontWeight: 600, color: "#334155" }}>
                                {haftalikOzet?.fazlaMi
                                    ? "Haftalık üst sınır aşıldı."
                                    : haftalikOzet?.yeterliMi
                                        ? "Haftalık hedef tamamlandı."
                                        : `Haftalık hedef için ${haftalikOzet?.kalanSaat || 0} saat daha gerekli.`}
                            </div>
                            {(haftalikOzet?.eklenecekSonrasiSaat || 0) > MAX_HAFTALIK && (
                                <div style={{ marginTop: 8, color: "#dc2626", fontWeight: 700 }}>
                                    Seçili saatlerle birlikte haftalık üst sınır aşılacak.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Slot ekleme formu */}
                    <div className="schedule-builder-card">
                        <div className="schedule-form-grid">
                            <div>
                                <label className="schedule-label">Hastane Seçiniz</label>
                                <div className="schedule-date-card">
                                    <div className="schedule-date-input-wrap">
                                        <span className="schedule-date-icon">🏥</span>
                                        <select
                                            className="schedule-date-input"
                                            value={doktorTakvimFormu.hastaneId}
                                            onChange={(e) => setDoktorTakvimFormu((prev) => ({ ...prev, hastaneId: e.target.value, seciliSaatler: [] }))}
                                        >
                                            <option value="">Hastane seçiniz</option>
                                            {HASTANELER.map((h) => <option key={h.id} value={h.id}>{h.ad}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="schedule-label">Gün Seçiniz</label>
                                <div className="schedule-date-card">
                                    <div className="schedule-date-input-wrap">
                                        <span className="schedule-date-icon">📅</span>
                                        <input
                                            type="date"
                                            className="schedule-date-input"
                                            value={doktorTakvimFormu.tarih}
                                            onChange={(e) => setDoktorTakvimFormu((prev) => ({ ...prev, tarih: e.target.value, seciliSaatler: [] }))}
                                        />
                                    </div>
                                    <div className="schedule-date-preview">
                                        {doktorTakvimFormu.tarih ? `Seçilen gün: ${formatTarih(doktorTakvimFormu.tarih)}` : "Henüz bir gün seçilmedi"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label className="schedule-label">Saat Seçiniz</label>
                            <div className="schedule-time-grid">
                                {SAAT_SECENEKLERI.map((saat) => (
                                    <button
                                        type="button"
                                        key={saat}
                                        className={`schedule-time-chip ${doktorTakvimFormu.seciliSaatler.includes(saat) ? "active" : ""}`}
                                        onClick={() => saatSeciminiDegistir(saat)}
                                    >
                                        {saat}
                                    </button>
                                ))}
                            </div>
                            <div className="schedule-selected-info">
                                {doktorTakvimFormu.seciliSaatler.length > 0
                                    ? `Seçilen saatler: ${doktorTakvimFormu.seciliSaatler.join(", ")}`
                                    : "Henüz saat seçilmedi"}
                            </div>
                        </div>

                        <button className="login-submit-btn" style={{ marginTop: 16 }} onClick={onSlotEkle}>
                            Seçili Slotları Ekle
                        </button>
                    </div>

                    <div style={{ marginBottom: 12, fontWeight: 600, color: "#475569" }}>
                        Bu haftaki toplam çalışma saatiniz: {haftalikOzet?.mevcutSaat || 0} / {haftalikOzet?.hedefSaat || VARSAYILAN_HEDEF}
                    </div>

                    {/* Slot tablosu */}
                    <table className="modern-table">
                        <thead>
                            <tr><th>Hastane</th><th>Tarih</th><th>Saat</th><th>Durum</th><th>İşlem</th></tr>
                        </thead>
                        <tbody>
                            {randevuSlotlari
                                .filter((s) => Number(s.doktorId) === Number(aktifDoktorDemoKaydi.id))
                                .sort(slotSirala)
                                .map((slot) => {
                                    const hastane = HASTANELER.find((h) => Number(h.id) === Number(slot.hastaneId));
                                    return (
                                        <tr key={slot.id}>
                                            <td>{hastane?.ad || "Hastane Yok"}</td>
                                            <td>{formatTarih(slot.tarih)}</td>
                                            <td>{slot.saat}</td>
                                            <td>
                                                <span className={`status-badge ${slot.durum === "MUSAIT" ? "status-active" : "status-pending"}`}>
                                                    {slot.durum}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => onSlotSil(slot.id)}
                                                    style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
                                                >
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            {randevuSlotlari.filter((s) => Number(s.doktorId) === Number(aktifDoktorDemoKaydi.id)).length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#64748b" }}>Henüz tanımlanmış çalışma slotunuz bulunmuyor.</td></tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}