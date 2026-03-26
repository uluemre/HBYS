import React from "react";
import { formatTarih } from "../../utils/helpers";

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
}) {
    return (
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
                                    <button className="process-btn" onClick={() => hastaGeldiIsaretle(item.id)}>Hasta Geldi</button>
                                    <button className="process-btn" onClick={() => muayeneBaslat(item)}>Muayeneyi Başlat</button>
                                    <button className="process-btn" onClick={() => tahlilIste(item)}>Tahlil İste</button>
                                    {muayene && (
                                        <>
                                            <button className="process-btn secondary" onClick={() => numuneVerildiIsaretle(muayene.id)}>Numune Verildi</button>
                                            <button className="process-btn secondary" onClick={() => tahlilSonucuHazirla(muayene.id)}>Sonucu Oluştur</button>
                                            <button className="process-btn secondary" onClick={() => sonucuIncele(muayene.id)}>Sonucu İncele</button>
                                            <button className="process-btn success" onClick={() => receteYaz(muayene.id, item.poliklinik)}>Reçete Yaz</button>
                                            <button className="process-btn complete" onClick={() => muayeneTamamla(item.id, muayene.id)}>Muayeneyi Tamamla</button>
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
    );
}