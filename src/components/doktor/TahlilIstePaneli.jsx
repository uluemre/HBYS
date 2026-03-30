// src/components/doktor/TahlilIstePaneli.jsx
import React, { useState } from "react";
import { formatTarih } from "../../utils/helpers";

// Renk yardımcısı – durum badge
const durumRenk = (durum) => {
    const map = {
        ONAYLANDI: "status-active",
        HASTA_GELDI: "status-active",
        MUAYENEDE: "status-pending",
        TAHLIL_BEKLENIYOR: "status-pending",
        TAMAMLANDI: "status-active",
    };
    return map[durum] || "status-pending";
};

export default function TahlilIstePaneli({ randevuListesi, aktifDoktorDemoKaydi }) {
    const [seciliRandevuId, setSeciliRandevuId] = useState("");
    const [parametre, setParametre] = useState("");
    const [yukleniyor, setYukleniyor] = useState(false);
    const [mesaj, setMesaj] = useState(null); // { tip: "ok"|"hata", metin }

    // Sadece doktora ait, aktif randevular
    const doktorRandevulari = randevuListesi.filter(
        (r) =>
            aktifDoktorDemoKaydi &&
            Number(r.doktorId) === Number(aktifDoktorDemoKaydi.id) &&
            ["ONAYLANDI", "HASTA_GELDI", "MUAYENEDE"].includes(r.durum)
    );

    const handleGonder = async () => {
        if (!seciliRandevuId) return setMesaj({ tip: "hata", metin: "Lütfen bir randevu seçiniz." });
        if (!parametre.trim()) return setMesaj({ tip: "hata", metin: "Lütfen parametre giriniz." });

        setYukleniyor(true);
        setMesaj(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://192.168.233.106:8081/api/tahlil/iste", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    randevuId: Number(seciliRandevuId),
                    parametre: parametre.trim(),
                }),
            });

            if (res.ok) {
                setMesaj({ tip: "ok", metin: "✅ Tahlil isteği başarıyla gönderildi!" });
                setSeciliRandevuId("");
                setParametre("");
            } else {
                const err = await res.json().catch(() => ({}));
                setMesaj({ tip: "hata", metin: `❌ ${err.message || "Tahlil isteği gönderilemedi."}` });
            }
        } catch {
            setMesaj({ tip: "hata", metin: "❌ Sunucu bağlantı hatası." });
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <div className="table-container">
            {/* ── Başlık ── */}
            <div className="table-header" style={{ marginBottom: 24 }}>
                <h3>🔬 Tahlil İste</h3>
                <p style={{ color: "#64748b", marginTop: 6 }}>
                    Aktif randevularınızdan birini seçerek laboratuvara tahlil isteği gönderin.
                </p>
            </div>

            {/* ── Form Kartı ── */}
            <div
                style={{
                    background: "linear-gradient(135deg, #f8fafc 0%, #eef6ff 100%)",
                    border: "1px solid #dbeafe",
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 28,
                }}
            >
                {/* Randevu Seç */}
                <label style={{ display: "block", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                    Randevu Seçiniz
                </label>
                <select
                    className="login-input"
                    value={seciliRandevuId}
                    onChange={(e) => setSeciliRandevuId(e.target.value)}
                    style={{ marginBottom: 16 }}
                >
                    <option value="">-- Randevu seçiniz --</option>
                    {doktorRandevulari.map((r) => (
                        <option key={r.id} value={r.id}>
                            #{r.id} — {r.poliklinik} — {formatTarih(r.tarih)} {r.saat} — Hasta ID: {r.hastaId}
                        </option>
                    ))}
                </select>

                {/* Seçili randevu önizleme */}
                {seciliRandevuId && (() => {
                    const r = doktorRandevulari.find((x) => String(x.id) === String(seciliRandevuId));
                    if (!r) return null;
                    return (
                        <div
                            style={{
                                background: "white",
                                border: "1px solid #e2e8f0",
                                borderRadius: 12,
                                padding: "14px 18px",
                                marginBottom: 16,
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                gap: 10,
                            }}
                        >
                            {[
                                ["Poliklinik", r.poliklinik],
                                ["Tarih / Saat", `${formatTarih(r.tarih)} — ${r.saat}`],
                                ["Şikayet", r.sikayet],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{k}</div>
                                    <div style={{ fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{v}</div>
                                </div>
                            ))}
                            <div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Durum</div>
                                <span className={`status-badge ${durumRenk(r.durum)}`} style={{ marginTop: 4, display: "inline-block" }}>
                                    {r.durum}
                                </span>
                            </div>
                        </div>
                    );
                })()}

                {/* Parametre */}
                <label style={{ display: "block", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                    Tahlil Parametresi
                </label>
                <input
                    type="text"
                    className="login-input"
                    placeholder="Örn: Kan, İdrar, CRP, Hemogram"
                    value={parametre}
                    onChange={(e) => setParametre(e.target.value)}
                    style={{ marginBottom: 16 }}
                />

                {/* Hazır Parametreler */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {["Hemogram", "CRP", "Biyokimya", "İdrar Tahlili", "B12 Vitamini", "TSH", "ALT/AST"].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() =>
                                setParametre((prev) =>
                                    prev ? `${prev}, ${p}` : p
                                )
                            }
                            style={{
                                padding: "6px 14px",
                                borderRadius: 999,
                                border: "1px solid #dbeafe",
                                background: parametre.includes(p) ? "#1a5f7a" : "white",
                                color: parametre.includes(p) ? "white" : "#1a5f7a",
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            + {p}
                        </button>
                    ))}
                </div>

                {/* Mesaj */}
                {mesaj && (
                    <div
                        style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            fontWeight: 600,
                            marginBottom: 16,
                            background: mesaj.tip === "ok" ? "#dcfce7" : "#fee2e2",
                            color: mesaj.tip === "ok" ? "#166534" : "#991b1b",
                            border: `1px solid ${mesaj.tip === "ok" ? "#bbf7d0" : "#fecaca"}`,
                        }}
                    >
                        {mesaj.metin}
                    </div>
                )}

                {/* Gönder */}
                <button
                    className="login-submit-btn"
                    onClick={handleGonder}
                    disabled={yukleniyor}
                    style={{ width: "auto", padding: "12px 32px", minWidth: 200 }}
                >
                    {yukleniyor ? "Gönderiliyor..." : "🔬 Tahlil İsteği Gönder"}
                </button>
            </div>

            {/* ── Aktif Randevular Tablosu ── */}
            <div style={{ fontWeight: 700, color: "#475569", marginBottom: 12 }}>
                Aktif Randevularınız ({doktorRandevulari.length})
            </div>
            {doktorRandevulari.length > 0 ? (
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Randevu ID</th>
                            <th>Poliklinik</th>
                            <th>Tarih / Saat</th>
                            <th>Şikayet</th>
                            <th>Durum</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doktorRandevulari.map((r) => (
                            <tr key={r.id}>
                                <td>#{r.id}</td>
                                <td>{r.poliklinik}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{formatTarih(r.tarih)}</div>
                                    <div style={{ fontSize: "0.85rem", color: "#1a5f7a" }}>🕒 {r.saat}</div>
                                </td>
                                <td>{r.sikayet}</td>
                                <td>
                                    <span className={`status-badge ${durumRenk(r.durum)}`}>{r.durum}</span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSeciliRandevuId(String(r.id))}
                                        style={{
                                            background: String(seciliRandevuId) === String(r.id) ? "#1a5f7a" : "#e0f2fe",
                                            color: String(seciliRandevuId) === String(r.id) ? "white" : "#1a5f7a",
                                            border: "none",
                                            padding: "8px 14px",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {String(seciliRandevuId) === String(r.id) ? "✓ Seçildi" : "Seç"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="mhrs-empty-state">
                    Aktif randevunuz bulunmamaktadır. Hasta randevu aldıktan sonra bu listede görünecektir.
                </div>
            )}
        </div>
    );
}