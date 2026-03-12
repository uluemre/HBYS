import React from 'react';

const TableRandevular = ({ veriler }) => (
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
                                <span
                                    className={`status-badge ${item.durum === 'Onaylandı' || item.durum === 'ONAYLANDI'
                                            ? 'status-active'
                                            : 'status-pending'
                                        }`}
                                >
                                    {item.durum}
                                </span>
                            </td>
                            <td>{item.sikayet}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                            Henüz aktif bir randevunuz bulunmamaktadır.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default TableRandevular;