import React from 'react';

const durumClassGetir = (durum) => {
  if (
    durum === "SONUCLANDI" ||
    durum === "DOKTOR_INCELEDI" ||
    durum === "RECETE_YAZILDI" ||
    durum === "TAMAMLANDI"
  ) {
    return "status-active";
  }

  if (
    durum === "ISTENDI" ||
    durum === "LABORATUVARDA" ||
    durum === "TAHLIL_BEKLENIYOR" ||
    durum === "SONUC_INCELENIYOR"
  ) {
    return "status-pending";
  }

  return "status-inactive";
};

const TableTahliller = ({ veriler = [] }) => (
  <div className="table-container">
    <div className="table-header">
      <h3>🔬 Laboratuvar Tahlil Sonuçları</h3>
    </div>

    <table className="modern-table">
      <thead>
        <tr>
          <th>Muayene Tarihi</th>
          <th>Poliklinik</th>
          <th>Doktor</th>
          <th>Tahlil Adı</th>
          <th>Sonuç Özeti</th>
          <th>Sonuç Tarihi</th>
          <th>Reçete Durumu</th>
          <th>Durum</th>
        </tr>
      </thead>

      <tbody>
        {veriler.length > 0 ? (
          veriler.map((item, index) => (
            <tr key={`${item.tahlilTuru}-${item.muayeneTarihi}-${index}`}>
              <td>{item.muayeneTarihi}</td>
              <td>{item.poliklinik}</td>
              <td>{item.doktor}</td>
              <td>{item.tahlilTuru}</td>
              <td>{item.sonucOzeti}</td>
              <td>{item.sonucTarihi}</td>
              <td>{item.receteDurumu}</td>
              <td>
                <span className={`status-badge ${durumClassGetir(item.durum)}`}>
                  {item.durum}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              Henüz görüntülenecek tahlil sonucu bulunmuyor.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TableTahliller;