import React, { useState } from 'react';

const TableReceteler = ({ veriler = [] }) => {
    const [acikReceteId, setAcikReceteId] = useState(null);

    return (
        <div className="table-container">
            <div className="table-header" style={{ marginBottom: 20 }}>
                <h3>💊 Reçetelerim</h3>
                <p style={{ color: '#64748b', marginTop: 8, fontSize: '0.9rem' }}>
                    Doktorlarınız tarafından yazılan tüm reçetelerinizi buradan görüntüleyebilirsiniz.
                </p>
            </div>

            {veriler.length === 0 ? (
                <div className="mhrs-empty-state">
                    Henüz yazılmış bir reçeteniz bulunmamaktadır.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {veriler.map((recete) => {
                        const acik = acikReceteId === recete.id;
                        return (
                            <div key={recete.id} style={styles.receteKart(acik)}>
                                {/* Üst kısım — her zaman görünür */}
                                <div
                                    style={styles.receteHeader}
                                    onClick={() => setAcikReceteId(acik ? null : recete.id)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={styles.receteIkon}>💊</div>
                                        <div>
                                            <div style={styles.receteBaslik}>{recete.poliklinik}</div>
                                            <div style={styles.receteAlt}>
                                                {recete.doktor} &nbsp;•&nbsp; {recete.tarih}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={styles.ilacSayiBadge}>
                                            {recete.ilaclar.length} ilaç
                                        </span>
                                        <span style={styles.chevron(acik)}>
                                            {acik ? '▲' : '▼'}
                                        </span>
                                    </div>
                                </div>

                                {/* Açılır detay */}
                                {acik && (
                                    <div style={styles.detayAlani}>
                                        {/* Doktor notu */}
                                        {recete.doktorNotu && (
                                            <div style={styles.notKutusu}>
                                                <span style={styles.notBaslik}>📋 Doktor Notu</span>
                                                <p style={styles.notMetin}>{recete.doktorNotu}</p>
                                            </div>
                                        )}

                                        {/* İlaç tablosu */}
                                        <div style={styles.ilacTabloWrapper}>
                                            <table style={styles.ilacTablo}>
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th}>#</th>
                                                        <th style={styles.th}>İlaç Adı</th>
                                                        <th style={styles.th}>Kullanım Şekli</th>
                                                        <th style={styles.th}>Süre</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recete.ilaclar.map((ilac, idx) => (
                                                        <tr key={idx} style={styles.ilacSatir(idx)}>
                                                            <td style={styles.td}>
                                                                <div style={styles.ilacNo}>{idx + 1}</div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.ilacAdi}>{ilac.ilacAdi}</div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.ilacKullanim}>{ilac.kullanim}</div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <span style={styles.sureBadge}>{ilac.sure}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Alt bilgi */}
                                        <div style={styles.altBilgi}>
                                            <span>🆔 Reçete No: <strong>{recete.id}</strong></span>
                                            <span>📅 Düzenleme Tarihi: <strong>{recete.tarih}</strong></span>
                                            <button
                                                style={styles.yazdir}
                                                onClick={() => window.print()}
                                            >
                                                🖨️ Yazdır
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = {
    receteKart: (acik) => ({
        background: '#ffffff',
        border: acik ? '1.5px solid #0ea5e9' : '1px solid #e2e8f0',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: acik ? '0 4px 20px rgba(14,165,233,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.25s ease',
    }),
    receteHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 22px',
        cursor: 'pointer',
        background: '#fafafa',
        userSelect: 'none',
    },
    receteIkon: {
        width: 46,
        height: 46,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #0ea5e9, #1a5f7a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        flexShrink: 0,
    },
    receteBaslik: {
        fontWeight: 700,
        fontSize: '1rem',
        color: '#0f172a',
        marginBottom: 3,
    },
    receteAlt: {
        fontSize: '0.85rem',
        color: '#64748b',
    },
    ilacSayiBadge: {
        background: '#e0f2fe',
        color: '#0369a1',
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: '0.78rem',
        fontWeight: 700,
    },
    chevron: (acik) => ({
        color: acik ? '#0ea5e9' : '#94a3b8',
        fontSize: '0.75rem',
        fontWeight: 700,
        transition: '0.2s',
    }),
    detayAlani: {
        padding: '0 22px 22px',
        borderTop: '1px solid #f1f5f9',
        background: '#ffffff',
        marginTop: 0,
    },
    notKutusu: {
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: 10,
        padding: '12px 16px',
        marginTop: 16,
        marginBottom: 16,
    },
    notBaslik: {
        fontWeight: 700,
        fontSize: '0.85rem',
        color: '#0369a1',
        display: 'block',
        marginBottom: 6,
    },
    notMetin: {
        margin: 0,
        color: '#334155',
        fontSize: '0.92rem',
        lineHeight: 1.6,
    },
    ilacTabloWrapper: {
        overflowX: 'auto',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        marginBottom: 16,
    },
    ilacTablo: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
    },
    th: {
        background: '#f8fafc',
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '0.78rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '14px 16px',
        borderBottom: '1px solid #f8fafc',
        verticalAlign: 'middle',
    },
    ilacSatir: (idx) => ({
        background: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
    }),
    ilacNo: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: '#e0f2fe',
        color: '#0369a1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.85rem',
    },
    ilacAdi: {
        fontWeight: 600,
        color: '#0f172a',
        fontSize: '0.95rem',
    },
    ilacKullanim: {
        color: '#475569',
        fontSize: '0.9rem',
    },
    sureBadge: {
        background: '#dcfce7',
        color: '#166534',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: '0.78rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
    },
    altBilgi: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        padding: '12px 0 0',
        fontSize: '0.83rem',
        color: '#64748b',
        borderTop: '1px dashed #e2e8f0',
    },
    yazdir: {
        marginLeft: 'auto',
        background: '#1a5f7a',
        color: 'white',
        border: 'none',
        padding: '8px 18px',
        borderRadius: 8,
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontFamily: 'Poppins, sans-serif',
    },
};

export default TableReceteler;