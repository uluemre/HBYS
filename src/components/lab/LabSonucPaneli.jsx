// src/components/lab/LabSonucPaneli.jsx
import React, { useState, useEffect } from "react";

export default function LabSonucPaneli() {
    const [tahlilListesi, setTahlilListesi] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [listeyukleniyor, setListeYukleniyor] = useState(true);

    // Sonuç form state — her tahlil için ayrı
    // { [tahlilId]: { sonuc, birim, referans } }
    const [formlar, setFormlar] = useState({});
    const [gonderimler, setGonderimler] = useState({}); // { [tahlilId]: "ok"|"hata"|null }

    const authHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Tahlil listesi çek
    const tahlilleriGetir = async () => {
        setListeYukleniyor(true);
        try {
            const res = await fetch("http://192.168.233.106:8081/api/tahlil/liste", {
                headers: authHeader(),
            });
            if (res.ok) {
                const data = await res.json();
                setTahlilListesi(Array.isArray(data) ? data : (data?.data ?? []));
            }
        } catch {
            // bağlantı yok — demo data
            setTahlilListesi([
                { id: 1, randevuId: "#1284", parametre: "Hemogram, CRP", durum: "ISTENDI", tarih: "2026-03-26" },
                { id: 2, randevuId: "#1285", parametre: "TSH, Biyokimya", durum: "ISTENDI", tarih: "2026-03-26" },
            ]);
        } finally {
            setListeYukleniyor(false);
        }
    };

    useEffect(() => {
        tahlilleriGetir();
    }, []);

    const formDegistir = (tahlilId, alan, deger) => {
        setFormlar((prev) => ({
            ...prev,
            [tahlilId]: { ...(prev[tahlilId] || {}), [alan]: deger },
        }));
    };

    const handleSonucGonder = async (tahlilId) => {
        const form = formlar[tahlilId] || {};
        if (!form.sonuc?.trim()) return setGonderimler((p) => ({ ...p, [tahlilId]: "hata" }));

        setYukleniyor(true);
        try {
            const res = await fetch("http://192.168.233.106:8081/api/tahlil/sonuc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader(),
                },
                body: JSON.stringify({
                    tahlilId: Number(tahlilId),
                    sonuc: form.sonuc.trim(),
                    birim: form.birim?.trim() || "",
                    referans: form.referans?.trim() || "",
                }),
            });

            if (res.ok) {
                setGonderimler((p) => ({ ...p, [tahlilId]: "ok" }));
                // Listeden kaldır
                setTahlilListesi((prev) => prev.filter((t) => t.id !== tahlilId));
            } else {
                setGonderimler((p) => ({ ...p, [tahlilId]: "hata" }));
            }
        } catch {
            setGonderimler((p) => ({ ...p, [tahlilId]: "hata" }));
        } finally {
            setYukleniyor(false);
        }
    };

    // Referans kontrolü — sayısal değer referans aralığının dışındaysa true
    const referansDisi = (sonuc, referans) => {
        if (!sonuc || !referans) return false;
        const sayisal = parseFloat(sonuc.replace(",", "."));
        if (Number.isNaN(sayisal)) return false;
        const match = referans.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
        if (!match) return false;
        const min = parseFloat(match[1]);
        const max = parseFloat(match[2]);
        return sayisal < min || sayisal > max;
    };

    return (
        <div className="table-container">
            {/* ── Başlık ── */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <div>
                    <h3 style={{ margin: 0 }}>🧪 Laboratuvar — Sonuç Giriş Paneli</h3>
                    <p style={{ color: "#64748b", marginTop: 6 }}>
                        Bekleyen tahlil isteklerini görüntüleyin ve sonuçları sisteme girin.
                    </p>
                </div>
                <button
                    onClick={tahlilleriGetir}
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

            {listeyukleniyor ? (
                <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                    Yükleniyor...
                </div>
            ) : tahlilListesi.length === 0 ? (
                <div className="mhrs-empty-state">
                    Bekleyen tahlil isteği bulunmamaktadır.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {tahlilListesi.map((tahlil) => {
                        const form = formlar[tahlil.id] || {};
                        const gonderim = gonderimler[tahlil.id];
                        const disi = referansDisi(form.sonuc, form.referans);

                        return (
                            <div
                                key={tahlil.id}
                                style={{
                                    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                                    border: `1px solid ${disi ? "#fecaca" : "#dbeafe"}`,
                                    borderRadius: 18,
                                    padding: 20,
                                    boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
                                    transition: "border-color 0.3s",
                                }}
                            >
                                {/* Üst bilgi */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: 14,
                                        flexWrap: "wrap",
                                        gap: 10,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>
                                            Tahlil ID: #{tahlil.id}
                                        </div>
                                        <div style={{ color: "#64748b", marginTop: 4 }}>
                                            Randevu: {tahlil.randevuId} | Parametre: <b>{tahlil.parametre}</b>
                                        </div>
                                        {tahlil.tarih && (
                                            <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 2 }}>
                                                İstek Tarihi: {tahlil.tarih}
                                            </div>
                                        )}
                                    </div>
                                    <span className="status-badge status-pending">{tahlil.durum || "ISTENDI"}</span>
                                </div>

                                {/* Input Alanları */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "2fr 1fr 1.5fr",
                                        gap: 12,
                                        marginBottom: 14,
                                    }}
                                >
                                    {/* Sonuç */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 700,
                                                fontSize: "0.82rem",
                                                color: "#475569",
                                                textTransform: "uppercase",
                                                marginBottom: 6,
                                            }}
                                        >
                                            Sonuç Değeri *
                                        </label>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                type="text"
                                                className="login-input"
                                                placeholder="Örn: 5.2"
                                                value={form.sonuc || ""}
                                                onChange={(e) => formDegistir(tahlil.id, "sonuc", e.target.value)}
                                                style={{
                                                    marginBottom: 0,
                                                    borderColor: disi ? "#ef4444" : undefined,
                                                    paddingRight: disi ? 36 : undefined,
                                                }}
                                            />
                                            {disi && (
                                                <span
                                                    title="Referans değeri dışında!"
                                                    style={{
                                                        position: "absolute",
                                                        right: 10,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        fontSize: "1.1rem",
                                                    }}
                                                >
                                                    ❗
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Birim */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 700,
                                                fontSize: "0.82rem",
                                                color: "#475569",
                                                textTransform: "uppercase",
                                                marginBottom: 6,
                                            }}
                                        >
                                            Birim
                                        </label>
                                        <input
                                            type="text"
                                            className="login-input"
                                            placeholder="Örn: mg/dL"
                                            value={form.birim || ""}
                                            onChange={(e) => formDegistir(tahlil.id, "birim", e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>

                                    {/* Referans */}
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 700,
                                                fontSize: "0.82rem",
                                                color: "#475569",
                                                textTransform: "uppercase",
                                                marginBottom: 6,
                                            }}
                                        >
                                            Referans Aralığı
                                        </label>
                                        <input
                                            type="text"
                                            className="login-input"
                                            placeholder="Örn: 3-6"
                                            value={form.referans || ""}
                                            onChange={(e) => formDegistir(tahlil.id, "referans", e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>
                                </div>

                                {/* Referans Uyarısı */}
                                {disi && (
                                    <div
                                        style={{
                                            background: "#fef2f2",
                                            border: "1px solid #fecaca",
                                            color: "#991b1b",
                                            borderRadius: 10,
                                            padding: "10px 14px",
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                            marginBottom: 14,
                                        }}
                                    >
                                        ❗ Girilen değer referans aralığının dışında! Lütfen kontrol ediniz.
                                    </div>
                                )}

                                {/* Gönderim Mesajı */}
                                {gonderim === "ok" && (
                                    <div
                                        style={{
                                            background: "#dcfce7",
                                            color: "#166534",
                                            borderRadius: 10,
                                            padding: "10px 14px",
                                            fontWeight: 600,
                                            marginBottom: 14,
                                        }}
                                    >
                                        ✅ Sonuç başarıyla kaydedildi.
                                    </div>
                                )}
                                {gonderim === "hata" && (
                                    <div
                                        style={{
                                            background: "#fee2e2",
                                            color: "#991b1b",
                                            borderRadius: 10,
                                            padding: "10px 14px",
                                            fontWeight: 600,
                                            marginBottom: 14,
                                        }}
                                    >
                                        ❌ Sonuç kaydedilemedi. Lütfen sonuç değerini girin.
                                    </div>
                                )}

                                {/* Buton */}
                                <button
                                    onClick={() => handleSonucGonder(tahlil.id)}
                                    disabled={yukleniyor}
                                    style={{
                                        background: "linear-gradient(135deg, #1a5f7a, #2980b9)",
                                        color: "white",
                                        border: "none",
                                        padding: "11px 28px",
                                        borderRadius: 12,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        transition: "0.2s",
                                        boxShadow: "0 4px 12px rgba(26,95,122,0.25)",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                                >
                                    {yukleniyor ? "Kaydediliyor..." : "💾 Sonucu Kaydet"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}