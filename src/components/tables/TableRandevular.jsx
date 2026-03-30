import React from 'react';

const IPTAL_EDILEBİLİR = ["ONAYLANDI"];

const durumClass = (durum) => {
    if (durum === "ONAYLANDI") return "status-active";
    if (durum === "IPTAL") return "status-cancel";
    return "status-pending";
};

const TableRandevular = ({ veriler, onIptal }) => (
    <div className="table-container">
        <div className="table-header">
            <h3>📅 Randevu Kayıtları</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Poliklinik</th>
                    <th>Doktor</th>
                    <th>Tarih & Saat</th>
                    <th>Durum</th>
                    <th>Şikayet</th>
                    {onIptal && <th>İşlem</th>}
                </tr>
            </thead>
            <tbody>
                {veriler && veriler.length > 0 ? (
                    veriler.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.poliklinik}</td>
                            <td>{item.doktor}</td>
                            <td>
                                <div style={{ fontWeight: '600' }}>{item.tarih}</div>
                                <div style={{ fontSize: '0.85rem', color: '#1a5f7a', marginTop: '2px' }}>
                                    🕒 {item.saat}
                                </div>
                            </td>
                            <td>
                                <span className={`status-badge ${durumClass(item.durum)}`}>
                                    {item.durum}
                                </span>
                            </td>
                            <td>{item.sikayet}</td>
                            {onIptal && (
                                <td>
                                    {IPTAL_EDILEBİLİR.includes(item.durum) ? (
                                        <button
                                            onClick={() => onIptal(item.id)}
                                            style={{
                                                background: "transparent",
                                                color: "#ef4444",
                                                border: "1.5px solid #ef4444",
                                                padding: "6px 14px",
                                                borderRadius: 8,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                fontSize: "0.82rem",
                                                fontFamily: "Poppins, sans-serif",
                                                transition: "0.2s",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "#ef4444";
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "#ef4444";
                                            }}
                                        >
                                            İptal Et
                                        </button>
                                    ) : (
                                        <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                                            {item.durum === "IPTAL" ? "İptal edildi" : "—"}
                                        </span>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={onIptal ? 7 : 6} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                            Henüz aktif bir randevunuz bulunmamaktadır.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default TableRandevular;