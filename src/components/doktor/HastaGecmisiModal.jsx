import React from "react";
import { formatTarih } from "../../utils/helpers";

export default function HastaGecmisiModal({ hastaAdi, gecmis, onKapat }) {
    return (
        <div style={st.overlay}>
            <div style={st.modal}>

                {/* Başlık */}
                <div style={st.header}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={st.avatar}>👤</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>
                                {hastaAdi || "Hasta"} — Geçmiş Muayeneler
                            </h3>
                            <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                                Tamamlanmış {gecmis.length} muayene kaydı
                            </p>
                        </div>
                    </div>
                    <button style={st.closeBtn} onClick={onKapat}>✕</button>
                </div>

                {/* İçerik */}
                <div style={st.body}>
                    {gecmis.length === 0 ? (
                        <div style={st.bos}>
                            Bu hastanın tamamlanmış muayene kaydı bulunmamaktadır.
                        </div>
                    ) : (
                        gecmis.map((kayit, idx) => (
                            <div key={kayit.randevuId} style={st.kayitKart(idx)}>

                                {/* Üst bilgi */}
                                <div style={st.kayitHeader}>
                                    <div style={st.tarihBadge}>
                                        📅 {formatTarih(kayit.tarih)} — {kayit.saat}
                                    </div>
                                    <span style={st.poliklinikBadge}>
                                        {kayit.poliklinik}
                                    </span>
                                </div>

                                {/* Şikayet & Tanı */}
                                <div style={st.bilgiGrid}>
                                    <div style={st.bilgiKutu}>
                                        <span style={st.bilgiBaslik}>🗣️ Şikayet</span>
                                        <span style={st.bilgiDeger}>{kayit.sikayet || "—"}</span>
                                    </div>
                                    <div style={st.bilgiKutu}>
                                        <span style={st.bilgiBaslik}>🔍 Ön Tanı</span>
                                        <span style={st.bilgiDeger}>{kayit.onTani}</span>
                                    </div>
                                    <div style={{ ...st.bilgiKutu, gridColumn: "span 2" }}>
                                        <span style={st.bilgiBaslik}>📋 Doktor Notu</span>
                                        <span style={st.bilgiDeger}>{kayit.doktorNotu}</span>
                                    </div>
                                </div>

                                {/* Tahliller */}
                                {kayit.tahliller.length > 0 && (
                                    <div style={st.bolum}>
                                        <div style={st.bolumBaslik}>🔬 İstenen Tahliller</div>
                                        <div style={st.chipSatir}>
                                            {kayit.tahliller.map((t) => (
                                                <span key={t.id} style={st.tahlilChip(t.durum)}>
                                                    {t.tahlilTuru}
                                                    <span style={st.tahlilDurum}>{t.durum}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tahlil sonuçları */}
                                {kayit.sonuclar.length > 0 && (
                                    <div style={st.bolum}>
                                        <div style={st.bolumBaslik}>📊 Tahlil Sonuçları</div>
                                        {kayit.sonuclar.map((s) => (
                                            <div key={s.id} style={st.sonucSatir}>
                                                <span style={st.sonucOzet}>{s.sonucOzeti}</span>
                                                {s.sonucDetaylari?.map((d, i) => (
                                                    <span key={i} style={st.sonucDetay(d.durum)}>
                                                        {d.parametre}: {d.deger} {d.birim}
                                                        {d.durum !== "Normal" && ` ⚠️ ${d.durum}`}
                                                    </span>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reçete */}
                                {kayit.recete && (
                                    <div style={st.bolum}>
                                        <div style={st.bolumBaslik}>💊 Yazılan Reçete</div>
                                        <div style={st.receteKutu}>
                                            {kayit.recete.ilaclar.map((ilac, i) => (
                                                <div key={i} style={st.ilacSatir}>
                                                    <span style={st.ilacNo}>{i + 1}</span>
                                                    <span style={st.ilacAdi}>{ilac.ilacAdi}</span>
                                                    <span style={st.ilacKullanim}>{ilac.kullanim}</span>
                                                    <span style={st.ilacSure}>{ilac.sure}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Alt */}
                <div style={st.footer}>
                    <button style={st.kapat} onClick={onKapat}>Kapat</button>
                </div>
            </div>
        </div>
    );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const st = {
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.55)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
    },
    modal: {
        background: "#fff", borderRadius: 18,
        width: "100%", maxWidth: 680,
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 22px 16px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafafa",
    },
    avatar: {
        width: 44, height: 44, borderRadius: 12,
        background: "linear-gradient(135deg, #1a5f7a, #0ea5e9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem",
    },
    closeBtn: {
        border: "none", background: "#f1f5f9", color: "#64748b",
        width: 32, height: 32, borderRadius: 8,
        cursor: "pointer", fontSize: "1rem", fontWeight: 700,
    },
    body: {
        flex: 1, overflowY: "auto", padding: "16px 22px",
        display: "flex", flexDirection: "column", gap: 16,
    },
    bos: {
        padding: 24, textAlign: "center", color: "#94a3b8",
        background: "#f8fafc", borderRadius: 12,
        border: "1px dashed #e2e8f0",
    },
    kayitKart: (idx) => ({
        background: idx % 2 === 0 ? "#ffffff" : "#fafbfc",
        border: "1px solid #e2e8f0",
        borderRadius: 14, padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
    }),
    kayitHeader: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 8,
    },
    tarihBadge: {
        fontWeight: 700, color: "#0f172a", fontSize: "0.95rem",
    },
    poliklinikBadge: {
        background: "#e0f2fe", color: "#0369a1",
        padding: "4px 12px", borderRadius: 999,
        fontSize: "0.78rem", fontWeight: 700,
    },
    bilgiGrid: {
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
    },
    bilgiKutu: {
        background: "#f8fafc", borderRadius: 10, padding: "10px 14px",
        display: "flex", flexDirection: "column", gap: 4,
    },
    bilgiBaslik: {
        fontSize: "0.75rem", fontWeight: 700,
        color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px",
    },
    bilgiDeger: {
        fontSize: "0.9rem", color: "#334155", lineHeight: 1.5,
    },
    bolum: {
        display: "flex", flexDirection: "column", gap: 8,
    },
    bolumBaslik: {
        fontSize: "0.82rem", fontWeight: 700,
        color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px",
    },
    chipSatir: {
        display: "flex", flexWrap: "wrap", gap: 8,
    },
    tahlilChip: (durum) => ({
        display: "inline-flex", alignItems: "center", gap: 6,
        background: durum === "SONUCLANDI" || durum === "DOKTOR_INCELEDI" ? "#dcfce7" : "#fef9c3",
        color: durum === "SONUCLANDI" || durum === "DOKTOR_INCELEDI" ? "#166534" : "#854d0e",
        padding: "5px 10px", borderRadius: 999,
        fontSize: "0.78rem", fontWeight: 600,
    }),
    tahlilDurum: {
        opacity: 0.7, fontSize: "0.72rem",
    },
    sonucSatir: {
        background: "#f8fafc", borderRadius: 10, padding: "10px 14px",
        display: "flex", flexDirection: "column", gap: 4,
    },
    sonucOzet: {
        fontWeight: 600, color: "#334155", fontSize: "0.88rem",
    },
    sonucDetay: (durum) => ({
        fontSize: "0.82rem",
        color: durum !== "Normal" ? "#dc2626" : "#64748b",
    }),
    receteKutu: {
        border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden",
    },
    ilacSatir: {
        display: "grid",
        gridTemplateColumns: "28px 1fr 1fr auto",
        gap: 10, padding: "10px 14px",
        alignItems: "center",
        borderBottom: "1px solid #f1f5f9",
        fontSize: "0.88rem",
    },
    ilacNo: {
        width: 24, height: 24, borderRadius: 6,
        background: "#e0f2fe", color: "#0369a1",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: "0.78rem",
    },
    ilacAdi: { fontWeight: 600, color: "#0f172a" },
    ilacKullanim: { color: "#64748b" },
    ilacSure: {
        background: "#dcfce7", color: "#166534",
        padding: "3px 8px", borderRadius: 999,
        fontSize: "0.75rem", fontWeight: 700,
        whiteSpace: "nowrap",
    },
    footer: {
        padding: "14px 22px",
        borderTop: "1px solid #f1f5f9",
        background: "#fafafa",
        display: "flex", justifyContent: "flex-end",
    },
    kapat: {
        padding: "10px 24px", border: "1.5px solid #e2e8f0",
        borderRadius: 10, background: "white",
        color: "#64748b", fontWeight: 600,
        cursor: "pointer", fontFamily: "Poppins, sans-serif",
        fontSize: "0.9rem",
    },
};