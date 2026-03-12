import React from 'react';

export const TableYatislar = () => (
    <div className="table-container">
        <div className="table-header">
            <h3>🛌 Hasta Yatış ve Servis Bilgileri</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>Oda No</th>
                    <th>Yatak</th>
                    <th>Servis</th>
                    <th>Yatış Tarihi</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Kat 3 - 304</td>
                    <td>Yatak-1</td>
                    <td>Kardiyoloji</td>
                    <td>20.02.2026</td>
                    <td><span className="status-badge status-active">Yatıyor</span></td>
                </tr>
            </tbody>
        </table>
    </div>
);

export const TableSikayet = () => (
    <div className="table-container">
        <div className="table-header">
            <h3>📩 Şikayet ve Öneriler</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>Kategori</th>
                    <th>Mesaj</th>
                    <th>Öncelik</th>
                    <th>Tarih</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Temizlik</td>
                    <td>Kat 2 lavaboları temizlenmeli.</td>
                    <td><span className="status-badge status-cancel">Yüksek</span></td>
                    <td>25.02.2026</td>
                </tr>
            </tbody>
        </table>
    </div>
);

export const TablePersonel = () => (
    <div className="table-container">
        <div className="table-header">
            <h3>👥 Hastane Personel Listesi</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>Ad Soyad</th>
                    <th>Rol</th>
                    <th>Birim</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ayşe Demir</td>
                    <td>Hemşire</td>
                    <td>Acil Servis</td>
                    <td><span className="status-badge status-active">Görevde</span></td>
                </tr>
                <tr>
                    <td>Mehmet Akif</td>
                    <td>Teknisyen</td>
                    <td>Radyoloji</td>
                    <td><span className="status-badge status-pending">İzinli</span></td>
                </tr>
            </tbody>
        </table>
    </div>
);