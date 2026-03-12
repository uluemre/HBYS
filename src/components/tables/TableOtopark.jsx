import React from 'react';

const TableOtopark = () => (
    <div className="table-container">
        <div className="table-header">
            <h3>🚗 Otopark Giriş-Çıkış Kayıtları</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>Plaka</th>
                    <th>Araç Tipi</th>
                    <th>Giriş Saati</th>
                    <th>Çıkış Saati</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>34 ABC 123</td>
                    <td>Binek Araç</td>
                    <td>08:15</td>
                    <td>11:30</td>
                    <td><span className="status-badge status-cancel">Çıkış Yaptı</span></td>
                </tr>
                <tr>
                    <td>81 DZ 081</td>
                    <td>SUV</td>
                    <td>10:45</td>
                    <td>--:--</td>
                    <td><span className="status-badge status-active">İçeride</span></td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default TableOtopark;