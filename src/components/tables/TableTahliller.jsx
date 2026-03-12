import React from 'react';

const TableTahliller = () => (
    <div className="table-container">
        <div className="table-header">
            <h3>🔬 Laboratuvar Tahlil Sonuçları</h3>
        </div>
        <table className="modern-table">
            <thead>
                <tr>
                    <th>Tahlil Adı</th>
                    <th>Sonuç Değeri</th>
                    <th>Referans Aralığı</th>
                    <th>Birim</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Hemoglobin (HGB)</td>
                    <td>14.2</td>
                    <td>13.5 - 17.5</td>
                    <td>g/dL</td>
                    <td><span className="status-badge status-active">Normal</span></td>
                </tr>
                <tr>
                    <td>B12 Vitamini</td>
                    <td>180</td>
                    <td>200 - 900</td>
                    <td>pg/mL</td>
                    <td><span className="status-badge status-cancel">Düşük</span></td>
                </tr>
            </tbody>
        </table>
    </div>
);

export default TableTahliller;