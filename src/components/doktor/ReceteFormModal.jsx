import React, { useState } from "react";
import { poliklinikIlaclariGetir } from "../../constants/ilaclar";

const SURE_SECENEKLERI = [
    "3 gün", "5 gün", "7 gün", "10 gün", "14 gün",
    "21 gün", "30 gün", "2 ay", "3 ay", "Süresiz"
];

const KULLANIM_SECENEKLERI = [
    "Günde 1 kez - sabah",
    "Günde 1 kez - akşam",
    "Günde 1 kez - gece",
    "Günde 2 kez - sabah/akşam",
    "Günde 3 kez",
    "Günde 4 kez",
    "8 saatte bir",
    "12 saatte bir",
    "Yemekten önce",
    "Yemekle birlikte",
    "Aç karnına",
    "Gerektiğinde",
    "Haftada 1 kez",
];

export default function ReceteFormModal({ randevu, tahlilSonuclari, onKapat, onKaydet }) {
    const ilacListesi = poliklinikIlaclariGetir(randevu?.poliklinik);

    const [seciliIlaclar, setSeciliIlaclar] = useState([]);
    const [doktorNotu, setDoktorNotu] = useState("");
    const [tanilar, setTanilar] = useState("");

    // Anormal değerleri hazırla — doktora göster
    const anormalDegerler = tahlilSonuclari.flatMap(s =>
        (s.sonucDetaylari || []).filter(d => d.durum !== "Normal")
    );

    const ilacEkle = (ilac) => {
        if (seciliIlaclar.find(i => i.ad === ilac.ad)) return;
        setSeciliIlaclar(prev => [
            ...prev,
            { ...ilac, kullanim: ilac.aciklama, sure: "7 gün", ozelNot: "" }
        ]);
    };

    const ilacGuncelle = (idx, alan, deger) => {
        setSeciliIlaclar(prev =>
            prev.map((item, i) => i === idx ? { ...item, [alan]: deger } : item)
        );
    };

    const ilacKaldir = (idx) => {
        setSeciliIlaclar(prev => prev.filter((_, i) => i !== idx));
    };

    const handleKaydet = () => {
        if (seciliIlaclar.length === 0) {
            alert("Lütfen en az bir ilaç ekleyin.");
            return;
        }
        onKaydet({
            ilaclar: seciliIlaclar.map(i => ({
                ilacAdi: i.ad,
                form: i.form,
                kullanim: i.kullanim,
                sure: i.sure,
                ozelNot: i.ozelNot,
            })),
            doktorNotu,
            tanilar,
        });
    };

    return (
        <div style={st.overlay}>
            <div style={st.modal}>

                {/* Başlık */}
                <div style={st.header}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>
                            💊 Reçete Yaz
                        </h3>
                        <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                            {randevu?.poliklinik} • {randevu?.doktor}
                        </p>
                    </div>
                    <button style={st.closeBtn} onClick={onKapat}>✕</button>
                </div>

                <div style={st.body}>

                    {/* Anormal değerler uyarısı */}
                    {anormalDegerler.length > 0 && (
                        <div style={st.uyariKutu}>
                            <div style={st.uyariBaslik}>⚠️ Anormal Tahlil Değerleri</div>
                            <div style={st.uyariGrid}>
                                {anormalDegerler.map((d, i) => (
                                    <span key={i} style={st.uyariChip(d.risk)}>
                                        {d.parametre}: <strong>{d.deger} {d.birim}</strong>
                                        &nbsp;({d.durum})
                                        {d.risk && <span style={st.riskEtiketi(d.risk)}>{d.risk}</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tanı alanı */}
                    <div style={st.bolum}>
                        <label style={st.label}>📋 Tanı / Ön Tanı</label>
                        <input
                            type="text"
                            placeholder="Örn: Demir eksikliği anemisi, Tip 2 DM..."
                            value={tanilar}
                            onChange={e => setTanilar(e.target.value)}
                            style={st.input}
                        />
                    </div>

                    {/* İlaç seçimi */}
                    <div style={st.bolum}>
                        <label style={st.label}>
                            💊 İlaç Listesi
                            <span style={{ color: "#64748b", fontWeight: 400, marginLeft: 8, fontSize: "0.82rem" }}>
                                ({randevu?.poliklinik} için önerilen ilaçlar)
                            </span>
                        </label>
                        <div style={st.ilacGrid}>
                            {ilacListesi.map((ilac, idx) => {
                                const secili = seciliIlaclar.find(i => i.ad === ilac.ad);
                                return (
                                    <button
                                        key={idx}
                                        style={st.ilacKarti(!!secili)}
                                        onClick={() => secili ? ilacKaldir(seciliIlaclar.findIndex(i => i.ad === ilac.ad)) : ilacEkle(ilac)}
                                    >
                                        <div style={st.ilacKartiAd}>{ilac.ad}</div>
                                        <div style={st.ilacKartiForm}>{ilac.form}</div>
                                        <div style={st.ilacKartiAciklama}>{ilac.aciklama}</div>
                                        {secili && <div style={st.seciliRozet}>✓ Eklendi</div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Seçili ilaçlar — düzenleme */}
                    {seciliIlaclar.length > 0 && (
                        <div style={st.bolum}>
                            <label style={st.label}>✏️ Seçili İlaçları Düzenle</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {seciliIlaclar.map((ilac, idx) => (
                                    <div key={idx} style={st.seciliIlacKart}>
                                        <div style={st.seciliIlacHeader}>
                                            <strong style={{ color: "#0f172a" }}>{ilac.ad}</strong>
                                            <span style={{ color: "#64748b", fontSize: "0.82rem" }}>{ilac.form}</span>
                                            <button
                                                style={st.kaldir}
                                                onClick={() => ilacKaldir(idx)}
                                            >
                                                × Kaldır
                                            </button>
                                        </div>
                                        <div style={st.seciliIlacForm}>
                                            <div style={{ flex: 2 }}>
                                                <label style={st.kucukLabel}>Kullanım Şekli</label>
                                                <select
                                                    value={ilac.kullanim}
                                                    onChange={e => ilacGuncelle(idx, "kullanim", e.target.value)}
                                                    style={st.select}
                                                >
                                                    {KULLANIM_SECENEKLERI.map(k => (
                                                        <option key={k} value={k}>{k}</option>
                                                    ))}
                                                    <option value={ilac.kullanim}>{ilac.kullanim}</option>
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={st.kucukLabel}>Süre</label>
                                                <select
                                                    value={ilac.sure}
                                                    onChange={e => ilacGuncelle(idx, "sure", e.target.value)}
                                                    style={st.select}
                                                >
                                                    {SURE_SECENEKLERI.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                <label style={st.kucukLabel}>Özel Not (opsiyonel)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ek talimat..."
                                                    value={ilac.ozelNot}
                                                    onChange={e => ilacGuncelle(idx, "ozelNot", e.target.value)}
                                                    style={st.input}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Doktor notu */}
                    <div style={st.bolum}>
                        <label style={st.label}>📝 Doktor Notu</label>
                        <textarea
                            placeholder="Hastaya özel notlar, kontrol tarihi, yaşam tarzı önerileri..."
                            value={doktorNotu}
                            onChange={e => setDoktorNotu(e.target.value)}
                            style={{ ...st.input, minHeight: 80, resize: "vertical" }}
                        />
                    </div>

                    {/* YZ Öneri placeholder */}
                    <div style={st.yzPlaceholder}>
                        <span style={{ fontSize: "1.2rem" }}>🤖</span>
                        <div>
                            <div style={{ fontWeight: 700, color: "#7c3aed", fontSize: "0.9rem" }}>
                                Yapay Zeka Önerisi
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                                Tahlil sonuçlarına göre ilaç önerisi yakında burada görünecek.
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={st.footer}>
                    <span style={{ color: "#64748b", fontSize: "0.88rem" }}>
                        {seciliIlaclar.length > 0
                            ? `${seciliIlaclar.length} ilaç seçildi`
                            : "Henüz ilaç seçilmedi"}
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={st.vazgec} onClick={onKapat}>Vazgeç</button>
                        <button
                            style={{
                                ...st.kaydet,
                                ...(seciliIlaclar.length === 0 ? { opacity: 0.45, cursor: "not-allowed" } : {})
                            }}
                            onClick={handleKaydet}
                            disabled={seciliIlaclar.length === 0}
                        >
                            Reçeteyi Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const st = {
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.6)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
    },
    modal: {
        background: "#fff", borderRadius: 18,
        width: "100%", maxWidth: 780,
        maxHeight: "92vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px 14px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafafa",
    },
    closeBtn: {
        border: "none", background: "#f1f5f9", color: "#64748b",
        width: 32, height: 32, borderRadius: 8,
        cursor: "pointer", fontSize: "1rem", fontWeight: 700,
    },
    body: {
        flex: 1, overflowY: "auto", padding: "18px 22px",
        display: "flex", flexDirection: "column", gap: 20,
    },
    uyariKutu: {
        background: "#fff7ed", border: "1px solid #fed7aa",
        borderRadius: 12, padding: "12px 16px",
    },
    uyariBaslik: {
        fontWeight: 700, color: "#9a3412",
        marginBottom: 10, fontSize: "0.88rem",
    },
    uyariGrid: {
        display: "flex", flexWrap: "wrap", gap: 8,
    },
    uyariChip: (risk) => ({
        background: risk === "Yüksek" ? "#fee2e2" : risk === "Orta" ? "#fef9c3" : "#f1f5f9",
        color: risk === "Yüksek" ? "#991b1b" : risk === "Orta" ? "#854d0e" : "#475569",
        padding: "5px 10px", borderRadius: 999,
        fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: 6,
    }),
    riskEtiketi: (risk) => ({
        background: risk === "Yüksek" ? "#ef4444" : risk === "Orta" ? "#f59e0b" : "#94a3b8",
        color: "white", padding: "2px 6px", borderRadius: 999,
        fontSize: "0.7rem", fontWeight: 700, marginLeft: 4,
    }),
    bolum: { display: "flex", flexDirection: "column", gap: 8 },
    label: { fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" },
    kucukLabel: {
        display: "block", fontSize: "0.75rem",
        fontWeight: 600, color: "#64748b",
        marginBottom: 4, textTransform: "uppercase",
    },
    input: {
        width: "100%", padding: "10px 14px",
        border: "1.5px solid #e2e8f0", borderRadius: 10,
        fontSize: "0.9rem", outline: "none",
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
        transition: "0.2s",
    },
    select: {
        width: "100%", padding: "10px 14px",
        border: "1.5px solid #e2e8f0", borderRadius: 10,
        fontSize: "0.88rem", outline: "none",
        fontFamily: "Poppins, sans-serif",
        background: "white", cursor: "pointer",
    },
    ilacGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 10,
    },
    ilacKarti: (secili) => ({
        border: secili ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
        borderRadius: 12, padding: "12px",
        background: secili ? "#f0f9ff" : "#fafafa",
        cursor: "pointer", textAlign: "left",
        transition: "0.15s",
        position: "relative",
    }),
    ilacKartiAd: { fontWeight: 700, color: "#0f172a", fontSize: "0.88rem", marginBottom: 2 },
    ilacKartiForm: { color: "#0ea5e9", fontSize: "0.75rem", fontWeight: 600, marginBottom: 4 },
    ilacKartiAciklama: { color: "#64748b", fontSize: "0.75rem", lineHeight: 1.4 },
    seciliRozet: {
        position: "absolute", top: 8, right: 8,
        background: "#0ea5e9", color: "white",
        fontSize: "0.68rem", fontWeight: 700,
        padding: "2px 7px", borderRadius: 999,
    },
    seciliIlacKart: {
        border: "1px solid #dbeafe", borderRadius: 12,
        padding: "14px 16px", background: "#f8fbff",
    },
    seciliIlacHeader: {
        display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
    },
    seciliIlacForm: { display: "flex", gap: 12, flexWrap: "wrap" },
    kaldir: {
        marginLeft: "auto", background: "transparent",
        color: "#ef4444", border: "1px solid #fecaca",
        padding: "4px 10px", borderRadius: 8,
        fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
        fontFamily: "Poppins, sans-serif",
    },
    yzPlaceholder: {
        display: "flex", alignItems: "center", gap: 12,
        background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
        border: "1px dashed #c4b5fd",
        borderRadius: 12, padding: "14px 18px",
    },
    footer: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 22px",
        borderTop: "1px solid #f1f5f9",
        background: "#fafafa",
    },
    vazgec: {
        padding: "10px 20px", border: "1.5px solid #e2e8f0",
        borderRadius: 10, background: "white",
        color: "#64748b", fontWeight: 600,
        cursor: "pointer", fontFamily: "Poppins, sans-serif",
        fontSize: "0.9rem",
    },
    kaydet: {
        padding: "10px 24px", border: "none",
        borderRadius: 10,
        background: "linear-gradient(135deg, #1a5f7a, #0ea5e9)",
        color: "white", fontWeight: 700,
        cursor: "pointer", fontFamily: "Poppins, sans-serif",
        fontSize: "0.9rem",
        boxShadow: "0 4px 12px rgba(14,165,233,0.25)",
    },
};