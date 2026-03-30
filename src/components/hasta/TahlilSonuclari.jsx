// src/components/hasta/TahlilSonuclari.jsx
import React, { useState, useEffect } from "react";

// Referans kontrolü
const referansDurumu = (sonuc, referans) => {
    if (!sonuc || !referans) return "bilinmiyor";
    const sayisal = parseFloat(String(sonuc).replace(",", "."));
    if (Number.isNaN(sayisal)) return "bilinmiyor";
    const match = String(referans).match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
    if (!match) return "bilinmiyor";
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    if (sayisal < min) return "dusuk";
    if (sayisal > max) return "yuksek";
    return "normal";
};

const durumRenkleri = {
    normal: {
        bg: "#f0fdf4",
        border: "#bbf7d0",
        badge: "#dcfce7",
        text: "#166534",
        icon: "✔",
        etiket: "Normal",
    },
    dusuk: {
        bg: "#fef9c3",
        border: "#fde047",
        badge: "#fef9c3",
        text: "#854d0e",
        icon: "⬇",
        etiket: "Düşük",
    },
    yuksek: {
        bg: "#fef2f2",
        border: "#fecaca",
        badge: "#fee2e2",
        text: "#991b1b",
        icon: "❗",
        etiket: "Yüksek",
    },
    bilinmiyor: {
        bg: "#f8fafc",
        border: "#e2e8f0",
        badge: "#f1f5f9",
        text: "#64748b",
        icon: "—",
        etiket: "Değerlendirilemedi",
    },
};

export default function TahlilSonuclari({ girisYapanKullanici }) {
    const [sonuclar, setSonuclar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState(null);

    const sonuclariGetir = async () => {
        setYukleniyor(true);
        setHata(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://192.168.233.106:8081/api/tahlil/sonuclar", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const data = await res.json();
                setSonuclar(Array.isArray(data) ? data : (data?.data ?? []));
            } else {
                setHata("Tahlil sonuçları alınamadı.");
            }
        } catch {
            setHata("Sunucu bağlantısı kurulamadı.");
            // Demo veri — bağlantı yokken göster
            setSonuclar([
                { id: 1, parametre: "Hemoglobin", sonuc: "10.8", birim: "g/dL", referans: "12-16", tarih: "2026-03-25" },
                { id: 2, parametre: "CRP", sonuc: "8.2", birim: "mg/L", referans: "0-5", tarih: "2026-03-25" },
                { id: 3, parametre: "Biyokimya (Glukoz)", sonuc: "92", birim: "mg/dL", referans: "70-100", tarih: "2026-03-24" },
                { id: 4, parametre: "B12 Vitamini", sonuc: "180", birim: "pg/mL", referans: "200-900", tarih: "2026-03-24" },
            ]);
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        sonuclariGetir();
    }, []);

    const normalSayisi = sonuclar.filter((s) => referansDurumu(s.sonuc, s.referans) === "normal").length;
    const anormalSayisi = sonuclar.length - normalSayisi;

    return (
        <div className="table-container">
            {/* ── Başlık ── */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <div>
                    <h3 style={{ margin: 0 }}>🔬 Tahlil Sonuçlarım</h3>
                    <p style={{ color: "#64748b", marginTop: 6 }}>
                        Mevcut tahlil sonuçlarınız aşağıda listelenmiştir.
                    </p>
                </div>
                <button
                    onClick={sonuclariGetir}
                    style={{
                        background: "#e0f2fe",
                        color: "#1a5f7a",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    🔄 Yenile
                </button>
            </div>

            {/* ── Özet Kartlar ── */}
            {!yukleniyor && sonuclar.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 14,
                        marginBottom: 24,
                    }}
                >
                    {[
                        { etiket: "Toplam Sonuç", deger: sonuclar.length, bg: "#f0f9ff", renk: "#0369a1", ikon: "📋" },
                        { etiket: "Normal Değerler", deger: normalSayisi, bg: "#f0fdf4", renk: "#166534", ikon: "✔" },
                        { etiket: "Dikkat Gerektiren", deger: anormalSayisi, bg: anormalSayisi > 0 ? "#fef2f2" : "#f8fafc", renk: anormalSayisi > 0 ? "#991b1b" : "#64748b", ikon: anormalSayisi > 0 ? "❗" : "—" },
                    ].map(({ etiket, deger, bg, renk, ikon }) => (
                        <div
                            key={etiket}
                            style={{
                                background: bg,
                                borderRadius: 14,
                                padding: "16px 20px",
                                border: `1px solid ${bg}`,
                            }}
                        >
                            <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{ikon}</div>
                            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: renk }}>{deger}</div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b", marginTop: 2 }}>{etiket}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── İçerik ── */}
            {yukleniyor ? (
                <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                    Sonuçlar yükleniyor...
                </div>
            ) : sonuclar.length === 0 ? (
                <div className="mhrs-empty-state">
                    Henüz tahlil sonucunuz bulunmamaktadır.
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 16,
                    }}
                >
                    {sonuclar.map((item) => {
                        const durum = referansDurumu(item.sonuc, item.referans);
                        const stil = durumRenkleri[durum];

                        return (
                            <div
                                key={item.id}
                                style={{
                                    background: stil.bg,
                                    border: `2px solid ${stil.border}`,
                                    borderRadius: 18,
                                    padding: 20,
                                    boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                            >
                                {/* Parametre + Durum */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 14,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            color: "#0f172a",
                                        }}
                                    >
                                        {item.parametre}
                                    </div>
                                    <span
                                        style={{
                                            background: stil.badge,
                                            color: stil.text,
                                            padding: "5px 12px",
                                            borderRadius: 999,
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                    >
                                        {stil.icon} {stil.etiket}
                                    </span>
                                </div>

                                {/* Değer */}
                                <div
                                    style={{
                                        fontSize: "2.2rem",
                                        fontWeight: 800,
                                        color: stil.text,
                                        lineHeight: 1,
                                        marginBottom: 6,
                                    }}
                                >
                                    {item.sonuc}
                                    <span
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            marginLeft: 6,
                                            color: "#64748b",
                                        }}
                                    >
                                        {item.birim}
                                    </span>
                                </div>

                                {/* Referans */}
                                {item.referans && (
                                    <div
                                        style={{
                                            fontSize: "0.85rem",
                                            color: "#64748b",
                                            marginBottom: 10,
                                        }}
                                    >
                                        Referans aralığı:{" "}
                                        <span style={{ fontWeight: 600, color: "#334155" }}>
                                            {item.referans} {item.birim}
                                        </span>
                                    </div>
                                )}

                                {/* Tarih */}
                                {item.tarih && (
                                    <div
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "#94a3b8",
                                            borderTop: `1px dashed ${stil.border}`,
                                            paddingTop: 10,
                                            marginTop: 6,
                                        }}
                                    >
                                        📅 {item.tarih}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Hata bildirimi (bağlantı yoksa demo data gösteriyor) ── */}
            {hata && sonuclar.length > 0 && (
                <div
                    style={{
                        marginTop: 16,
                        padding: "10px 16px",
                        background: "#fef9c3",
                        border: "1px solid #fde047",
                        borderRadius: 10,
                        color: "#854d0e",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                    }}
                >
                    ⚠️ Sunucuya bağlanılamadı — demo veriler gösteriliyor.
                </div>
            )}
        </div>
    );
}