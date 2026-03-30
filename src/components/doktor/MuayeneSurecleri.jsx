import React, { useState } from "react";
import { formatTarih } from "../../utils/helpers";
import HastaGecmisiModal from "./HastaGecmisiModal";
import ReceteFormModal from "./ReceteFormModal";
// ─── Tahlil kataloğu ──────────────────────────────────────────────────────────
const TAHLIL_KATALOGU = {
    "Kan Tahlilleri": [
        "Hemogram (Tam Kan Sayımı)",
        "Biyokimya Paneli",
        "CRP (C-Reaktif Protein)",
        "Sedimantasyon (ESR)",
        "Tam Kan Grubu",
        "Troponin",
        "D-Dimer",
        "Ferritin",
        "Serum Demir",
        "Transferrin",
    ],
    "Hormon Tahlilleri": [
        "TSH (Tiroid Stimülan Hormon)",
        "T3 / T4 (Serbest)",
        "FSH / LH",
        "Prolaktin",
        "Kortizol",
        "İnsülin",
        "Beta HCG (Gebelik)",
        "Testosteron",
        "Östradiol (E2)",
        "DHEA-S",
    ],
    "Vitamin & Mineral": [
        "B12 Vitamini",
        "D Vitamini (25-OH)",
        "Folik Asit",
        "Magnezyum",
        "Kalsiyum",
        "Fosfor",
        "Çinko",
        "Selenyum",
    ],
    "İdrar Tahlilleri": [
        "Tam İdrar Tahlili",
        "İdrar Kültürü",
        "Mikroalbumin (İdrarda)",
        "İdrar Kreatinini",
    ],
    "Biyokimya / Organ Fonksiyon": [
        "ALT (Karaciğer Enzimi)",
        "AST (Karaciğer Enzimi)",
        "GGT",
        "ALP",
        "Total Bilirubin",
        "Kreatinin",
        "Üre / BUN",
        "Ürik Asit",
        "Glukoz (Açlık)",
        "HbA1c (Şeker Ort.)",
        "Total Kolesterol",
        "LDL / HDL Kolesterol",
        "Trigliserit",
        "Amilaz / Lipaz",
    ],
    "Enfeksiyon & İmmün": [
        "HBsAg (Hepatit B)",
        "Anti-HCV (Hepatit C)",
        "HIV Antikoru",
        "Widal (Tifo)",
        "Brucella Aglütinasyon",
        "ASO (Streptokok)",
        "RF (Romatoid Faktör)",
        "ANA (Antinükleer Antikor)",
        "IgE (Alerji)",
    ],
    "Onkoloji Belirteçleri": [
        "PSA (Prostat)",
        "CA 125 (Yumurtalık)",
        "CA 19-9 (Pankreas)",
        "CEA (Kolorektal)",
        "AFP (Karaciğer)",
        "CA 15-3 (Meme)",
    ],
};

// ─── Tahlil Seçim Modalı ─────────────────────────────────────────────────────
function TahlilSecimModal({ onKapat, onOnayla }) {
    const [secili, setSecili] = useState([]);
    const [aramaMetni, setAramaMetni] = useState("");
    const [acikKategori, setAcikKategori] = useState("Kan Tahlilleri");

    const toggleTahlil = (tahlil) => {
        setSecili((prev) =>
            prev.includes(tahlil) ? prev.filter((t) => t !== tahlil) : [...prev, tahlil]
        );
    };

    const filtreliKatalog = aramaMetni.trim()
        ? Object.fromEntries(
            Object.entries(TAHLIL_KATALOGU)
                .map(([kat, liste]) => [
                    kat,
                    liste.filter((t) =>
                        t.toLowerCase().includes(aramaMetni.toLowerCase())
                    ),
                ])
                .filter(([, liste]) => liste.length > 0)
        )
        : TAHLIL_KATALOGU;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Başlık */}
                <div style={styles.header}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}>
                            🔬 Tahlil İste
                        </h3>
                        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.88rem" }}>
                            İstediğiniz tetkikleri seçin ve onaylayın.
                        </p>
                    </div>
                    <button style={styles.closeBtn} onClick={onKapat}>✕</button>
                </div>

                {/* Arama */}
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <input
                        type="text"
                        placeholder="🔍 Tahlil ara..."
                        value={aramaMetni}
                        onChange={(e) => setAramaMetni(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.body}>
                    {/* Kategori sekmeleri */}
                    {!aramaMetni && (
                        <div style={styles.tabBar}>
                            {Object.keys(TAHLIL_KATALOGU).map((kat) => (
                                <button
                                    key={kat}
                                    style={{
                                        ...styles.tabBtn,
                                        ...(acikKategori === kat ? styles.tabBtnActive : {}),
                                    }}
                                    onClick={() => setAcikKategori(kat)}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tahlil listesi */}
                    <div style={styles.listArea}>
                        {Object.entries(filtreliKatalog).map(([kat, liste]) => {
                            const goster = aramaMetni || kat === acikKategori;
                            if (!goster) return null;
                            return (
                                <div key={kat}>
                                    {aramaMetni && (
                                        <div style={styles.katBaslik}>{kat}</div>
                                    )}
                                    {liste.map((tahlil) => {
                                        const secildi = secili.includes(tahlil);
                                        return (
                                            <label key={tahlil} style={styles.tahlilRow(secildi)}>
                                                <input
                                                    type="checkbox"
                                                    checked={secildi}
                                                    onChange={() => toggleTahlil(tahlil)}
                                                    style={{ display: "none" }}
                                                />
                                                <div style={styles.checkbox(secildi)}>
                                                    {secildi && "✓"}
                                                </div>
                                                <span style={{ fontSize: "0.93rem", color: secildi ? "#0f172a" : "#334155" }}>
                                                    {tahlil}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {Object.keys(filtreliKatalog).length === 0 && (
                            <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                                Arama sonucu bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

                {/* Alt bar */}
                <div style={styles.footer}>
                    <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                        {secili.length > 0
                            ? `${secili.length} tahlil seçildi`
                            : "Henüz seçim yapılmadı"}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={styles.cancelBtn} onClick={onKapat}>
                            Vazgeç
                        </button>
                        <button
                            style={{
                                ...styles.confirmBtn,
                                ...(secili.length === 0 ? styles.confirmBtnDisabled : {}),
                            }}
                            onClick={() => secili.length > 0 && onOnayla(secili)}
                            disabled={secili.length === 0}
                        >
                            Tahlilleri İste ({secili.length})
                        </button>
                    </div>
                </div>

                {/* Seçili tahlil etiketleri */}
                {secili.length > 0 && (
                    <div style={styles.chipArea}>
                        {secili.map((t) => (
                            <span key={t} style={styles.chip}>
                                {t}
                                <button
                                    style={styles.chipRemove}
                                    onClick={() => toggleTahlil(t)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    modal: {
        background: "#ffffff",
        borderRadius: 18,
        width: "100%",
        maxWidth: 620,
        maxHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px 20px 16px",
        borderBottom: "1px solid #f1f5f9",
    },
    closeBtn: {
        border: "none",
        background: "#f1f5f9",
        color: "#64748b",
        width: 32,
        height: 32,
        borderRadius: 8,
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 700,
    },
    searchInput: {
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid #e2e8f0",
        borderRadius: 10,
        fontSize: "0.93rem",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
    },
    body: {
        display: "flex",
        flex: 1,
        overflow: "hidden",
    },
    tabBar: {
        width: 160,
        flexShrink: 0,
        borderRight: "1px solid #f1f5f9",
        overflowY: "auto",
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    tabBtn: {
        padding: "9px 12px",
        border: "none",
        borderRadius: 8,
        background: "transparent",
        color: "#64748b",
        fontSize: "0.82rem",
        fontWeight: 500,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "Poppins, sans-serif",
        transition: "0.15s",
    },
    tabBtnActive: {
        background: "#e0f2fe",
        color: "#0369a1",
        fontWeight: 700,
    },
    listArea: {
        flex: 1,
        overflowY: "auto",
        padding: "10px 16px",
    },
    katBaslik: {
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 1,
        padding: "10px 0 6px",
    },
    tahlilRow: (secildi) => ({
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 4,
        background: secildi ? "#f0f9ff" : "transparent",
        border: secildi ? "1px solid #bae6fd" : "1px solid transparent",
        transition: "0.15s",
        userSelect: "none",
    }),
    checkbox: (secildi) => ({
        width: 20,
        height: 20,
        borderRadius: 6,
        border: secildi ? "2px solid #0ea5e9" : "2px solid #cbd5e1",
        background: secildi ? "#0ea5e9" : "white",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontWeight: 800,
        flexShrink: 0,
        transition: "0.15s",
    }),
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        borderTop: "1px solid #f1f5f9",
        background: "#fafafa",
    },
    cancelBtn: {
        padding: "10px 20px",
        border: "1.5px solid #e2e8f0",
        borderRadius: 10,
        background: "white",
        color: "#64748b",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.9rem",
    },
    confirmBtn: {
        padding: "10px 22px",
        border: "none",
        borderRadius: 10,
        background: "linear-gradient(135deg, #1a5f7a, #0ea5e9)",
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.9rem",
        boxShadow: "0 4px 12px rgba(14,165,233,0.25)",
    },
    confirmBtnDisabled: {
        opacity: 0.45,
        cursor: "not-allowed",
        boxShadow: "none",
    },
    chipArea: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "10px 20px 14px",
        borderTop: "1px solid #f1f5f9",
        maxHeight: 90,
        overflowY: "auto",
    },
    chip: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#e0f2fe",
        color: "#0369a1",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: "0.78rem",
        fontWeight: 600,
    },
    chipRemove: {
        border: "none",
        background: "transparent",
        color: "#0369a1",
        cursor: "pointer",
        fontSize: "1rem",
        lineHeight: 1,
        padding: 0,
        fontWeight: 700,
    },
};

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function MuayeneSurecleri({
    surecleri,
    hastaGeldiIsaretle,
    muayeneBaslat,
    tahlilIste,
    numuneVerildiIsaretle,
    tahlilSonucuHazirla,
    sonucuIncele,
    receteYaz,
    muayeneTamamla,
    buildHastaGecmisi,
}) {
    const [modalAcikRandevuId, setModalAcikRandevuId] = useState(null);
    const [gecmisModalHasta, setGecmisModalHasta] = useState(null);
    const [receteModalItem, setReceteModalItem] = useState(null);
    const muayeneGecmisi = gecmisModalHasta
        ? buildHastaGecmisi(gecmisModalHasta.hastaId, gecmisModalHasta.doktorId)
        : [];

    const handleTahlilOnayla = (randevu, seciliTahliller) => {
        tahlilIste(randevu, seciliTahliller);
        setModalAcikRandevuId(null);
    };

    return (
        <>
            {/* Tahlil seçim modalı */}
            {modalAcikRandevuId !== null && (() => {
                const hedefRandevu = surecleri.find(
                    (s) => String(s.id) === String(modalAcikRandevuId)
                );
                if (!hedefRandevu) return null;

                return (
                    <TahlilSecimModal
                        onKapat={() => setModalAcikRandevuId(null)}
                        onOnayla={(secili) =>
                            handleTahlilOnayla(hedefRandevu, secili)
                        }
                    />
                );
            })()}

            {/* ✅ REÇETE MODAL */}
            {receteModalItem && (
                <ReceteFormModal
                    randevu={receteModalItem}
                    tahlilSonuclari={receteModalItem.sonuclar}
                    onKapat={() => setReceteModalItem(null)}
                    onKaydet={(recetePaketi) => {
                        receteYaz(receteModalItem.muayene.id, recetePaketi);
                        setReceteModalItem(null);
                    }}
                />
            )}

            {/* ✅ GEÇMİŞ MODAL */}
            {gecmisModalHasta && (
                <HastaGecmisiModal
                    hastaAdi={gecmisModalHasta.hastaAdi}
                    gecmis={muayeneGecmisi}
                    onKapat={() => setGecmisModalHasta(null)}
                />
            )}

            {/* BURADAN SONRA ANA UI GELİR */}
            <div className="table-container">
                <div className="table-header" style={{ marginBottom: 20 }}>
                    <h3>🩺 Muayene ve Tahlil Süreç Yönetimi</h3>
                    <p style={{ color: "#64748b", marginTop: 8 }}>
                        Randevu alan hastaları adım adım yönetin: hasta geldi, muayene
                        başladı, tahlil istendi, sonuçlandı, reçete yazıldı ve tamamlandı.
                    </p>
                </div>

                <div className="muayene-flow-list">
                    {surecleri.length > 0 ? (
                        surecleri.map((item) => {
                            const muayene = item.muayene;
                            const durum = muayene?.durum || item.durum;

                            return (
                                <div key={item.id} className="muayene-flow-card">
                                    <div className="muayene-flow-top">
                                        <div>
                                            <h4>{item.doktor} • {item.poliklinik}</h4>
                                            <p>Randevu ID: {item.id}</p>
                                        </div>
                                        <span
                                            className={`status-badge ${["TAMAMLANDI", "RECETE_YAZILDI", "DOKTOR_INCELEDI"].includes(durum)
                                                ? "status-active"
                                                : "status-pending"
                                                }`}
                                        >
                                            {durum}
                                        </span>
                                    </div>

                                    <div className="muayene-flow-meta">
                                        <div><strong>Tarih:</strong> {formatTarih(item.tarih)}</div>
                                        <div><strong>Saat:</strong> {item.saat}</div>
                                        <div><strong>Şikayet:</strong> {item.sikayet}</div>
                                    </div>

                                    <div className="surec-adimlari">
                                        {[
                                            { label: "Hasta Geldi", aktif: item.durum === "HASTA_GELDI" || item.durum === "MUAYENEDE" || !!muayene },
                                            { label: "Muayene Başladı", aktif: !!muayene },
                                            { label: "Tahlil İstendi", aktif: item.tahliller.length > 0 },
                                            { label: "Numune / Lab", aktif: item.tahliller.some((t) => ["LABORATUVARDA", "SONUCLANDI", "DOKTOR_INCELEDI"].includes(t.durum)) },
                                            { label: "Sonuçlandı", aktif: item.sonuclar.length > 0 },
                                            { label: "Reçete", aktif: !!item.recete },
                                            { label: "Tamamlandı", aktif: durum === "TAMAMLANDI" },
                                        ].map(({ label, aktif }) => (
                                            <span key={label} className={`surec-chip ${aktif ? "active" : ""}`}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>

                                    {muayene && (
                                        <div className="muayene-detay-box">
                                            <p><strong>Ön Tanı:</strong> {muayene.onTani}</p>
                                            <p><strong>Doktor Notu:</strong> {muayene.doktorNotu}</p>
                                            {item.tahliller.length > 0 && (
                                                <p>
                                                    <strong>İstenen Tahliller:</strong>{" "}
                                                    {item.tahliller.map((t) => `${t.tahlilTuru} (${t.durum})`).join(", ")}
                                                </p>
                                            )}
                                            {item.sonuclar.length > 0 && (
                                                <p>
                                                    <strong>Sonuç Özeti:</strong>{" "}
                                                    {item.sonuclar.map((s) => s.sonucOzeti).join(" | ")}
                                                </p>
                                            )}
                                            {item.recete && (
                                                <p>
                                                    <strong>Reçete:</strong>{" "}
                                                    {item.recete.ilaclar.map((i) => `${i.ilacAdi} - ${i.kullanim}`).join(" / ")}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="muayene-action-row">
                                        <button className="process-btn" onClick={() => hastaGeldiIsaretle(item.id)}>
                                            Hasta Geldi
                                        </button>
                                        <button
                                            className="process-btn"
                                            style={{ background: "#7c3aed" }}
                                            onClick={() =>
                                                setGecmisModalHasta({
                                                    hastaAdi: item.doktor,
                                                    hastaId: item.hastaId,
                                                    doktorId: item.doktorId,
                                                })
                                            }
                                        >
                                            Hasta Geçmişi
                                        </button>
                                        <button className="process-btn" onClick={() => muayeneBaslat(item)}>
                                            Muayeneyi Başlat
                                        </button>

                                        {/* Tahlil İste → modal açar */}
                                        <button
                                            className="process-btn"
                                            onClick={() => {
                                                if (!muayene) return alert("Önce muayeneyi başlatmalısınız.");
                                                if (item.tahliller.length > 0) return alert("Bu muayene için tahlil zaten istenmiş.");
                                                setModalAcikRandevuId(item.id);
                                            }}
                                        >
                                            Tahlil İste
                                        </button>

                                        {muayene && (
                                            <>
                                                <button className="process-btn secondary" onClick={() => numuneVerildiIsaretle(muayene.id)}>
                                                    Numune Verildi
                                                </button>
                                                <button className="process-btn secondary" onClick={() => tahlilSonucuHazirla(muayene.id)}>
                                                    Sonucu Oluştur
                                                </button>
                                                <button className="process-btn secondary" onClick={() => sonucuIncele(muayene.id)}>
                                                    Sonucu İncele
                                                </button>
                                                <button
                                                    className="process-btn success"
                                                    onClick={() => setReceteModalItem({ ...item })}
                                                >
                                                    Reçete Yaz
                                                </button>
                                                <button className="process-btn complete" onClick={() => muayeneTamamla(item.id, muayene.id)}>
                                                    Muayeneyi Tamamla
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="mhrs-empty-state">Doktora ait aktif muayene süreci bulunamadı.</div>
                    )}
                </div>
            </div>
        </>
    );
}
