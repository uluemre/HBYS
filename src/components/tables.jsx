import React from 'react';

// 1. RANDEVULAR TABLOSU (Dinamik Yapı & Saat Bilgisi)
export const TableRandevular = ({ veriler }) => (
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
        {/* App.jsx'den gelen veriler varsa listele, yoksa uyarı ver */}
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
                <span className={`status-badge ${item.durum === 'Onaylandı' ? 'status-active' : 'status-pending'}`}>
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

// 2. TAHLİLLER TABLOSU
export const TableTahliller = () => (
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

// 3. OTOPARK TABLOSU
export const TableOtopark = () => (
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

// 4. YATIŞLAR TABLOSU
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

// 5. ŞİKAYET VE ÖNERİ TABLOSU
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

// 6. PERSONEL LİSTESİ TABLOSU
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

// 7. PROFİL KARTI
export const ProfileCard = ({ kullanici }) => (
  <div className="profile-card-container">
    <div className="profile-header-main">
      <div className="profile-avatar-large">👤</div>
      <h3>{kullanici?.ad || "Yasin Portakal"}</h3>
      <span className="badge-rol">TC No: {kullanici?.tc || "12345678901"}</span>
    </div>
    <div className="profile-grid">
      <div className="profile-item"><strong>Cinsiyet</strong><span>Erkek</span></div>
      <div className="profile-item"><strong>Doğum Tarihi</strong><span>15.05.1990</span></div>
      <div className="profile-item"><strong>Kan Grubu</strong><span>0 Rh+</span></div>
      <div className="profile-item"><strong>Telefon</strong><span>0555 555 55 55</span></div>
      <div className="profile-item full-width"><strong>Adres</strong><span>Örnek Mah. Düzce/Türkiye</span></div>
    </div>
  </div>
);