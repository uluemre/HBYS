console.log("YENI TABLEPERSONEL CALISTI");
const gorevEtiketi = (gorev) => {
  const map = {
    HEMSIRE: "Hemşire",
    TIBBI_SEKRETER: "Tıbbi Sekreter",
    SEKRETER: "Sekreter",
    HASTA_BAKICI: "Hasta Bakıcı",
    PERSONEL: "Personel"
  };

  return map[gorev] || gorev || "—";
};

const durumEtiketi = (durum) => {
  if (!durum) return "—";
  return durum;
};

const TablePersonel = ({ personel }) => {
  if (!personel) {
    return <div className="mhrs-empty-state">Personel bilgisi bulunamadı.</div>;
  }

  const desteklenenGorevler = ["HEMSIRE", "TIBBI_SEKRETER", "SEKRETER", "HASTA_BAKICI"];
  const aktifGorev = personel.gorev || personel.rol;

  if (!desteklenenGorevler.includes(aktifGorev)) {
    return (
      <div className="table-container">
        <div className="table-header" style={{ marginBottom: "20px" }}>
          <h3>👤 Personel Bilgileri</h3>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            Bu görev türü için özel panel henüz tanımlanmadı.
          </p>
        </div>

        <table className="modern-table">
          <tbody>
            <tr>
              <td><strong>Ad Soyad</strong></td>
              <td>{personel.adSoyad || "—"}</td>
            </tr>
            <tr>
              <td><strong>T.C. No</strong></td>
              <td>{personel.tc || "—"}</td>
            </tr>
            <tr>
              <td><strong>Telefon</strong></td>
              <td>{personel.telefon || "—"}</td>
            </tr>
            <tr>
              <td><strong>Görev</strong></td>
              <td>{gorevEtiketi(aktifGorev)}</td>
            </tr>
            <tr>
              <td><strong>Birim</strong></td>
              <td>{personel.birimAdi || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const varsayilanGorevler = {
    HEMSIRE: [
      "Serviste hasta takiplerini kontrol et",
      "İlaç uygulama saatlerini takip et",
      "Vital bulgu kayıtlarını tamamla"
    ],
    TIBBI_SEKRETER: [
      "Hasta kayıt işlemlerini kontrol et",
      "Poliklinik evraklarını düzenle",
      "Randevu yönlendirmelerini takip et"
    ],
    SEKRETER: [
      "Günlük kayıt ve yönlendirme işlemlerini tamamla",
      "Evrak ve bilgi akışını kontrol et",
      "Telefon ve danışma notlarını güncelle"
    ],
    HASTA_BAKICI: [
      "Servis içi hasta destek işlemlerini takip et",
      "Hasta taşıma ve yönlendirme görevlerini tamamla",
      "Günlük bakım destek listesini kontrol et"
    ]
  };

  const gunlukGorevler =
    Array.isArray(personel.gunlukGorevler) && personel.gunlukGorevler.length > 0
      ? personel.gunlukGorevler
      : varsayilanGorevler[aktifGorev] || [];

  const roleSpecificTitle =
    aktifGorev === "HEMSIRE"
      ? "Hemşire Paneli"
      : aktifGorev === "HASTA_BAKICI"
      ? "Hasta Bakıcı Paneli"
      : "Sekreter Paneli";

  const roleSpecificInfo =
    aktifGorev === "HEMSIRE"
      ? [
          { title: "Sorumlu Alan", value: personel.birimAdi || "Servis / Poliklinik" },
          { title: "Takip Türü", value: "Hasta Takibi ve Uygulama" },
          { title: "Öncelik", value: "Servis İşleyişi" }
        ]
      : aktifGorev === "HASTA_BAKICI"
      ? [
          { title: "Sorumlu Alan", value: personel.birimAdi || "Servis" },
          { title: "Takip Türü", value: "Bakım ve Destek" },
          { title: "Öncelik", value: "Hasta Destek Süreci" }
        ]
      : [
          { title: "Sorumlu Alan", value: personel.birimAdi || "Hasta Kabul / Sekreterya" },
          { title: "Takip Türü", value: "Kayıt ve Evrak" },
          { title: "Öncelik", value: "Hasta Yönlendirme" }
        ];

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "20px" }}>
        <h3>👤 {roleSpecificTitle}</h3>
        <p style={{ color: "#64748b", marginTop: "8px" }}>
          Kişisel bilgileriniz, mesai düzeniniz ve günlük görevleriniz burada görüntülenir.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <div className="mhrs-secondary-panel">
          <h3>Ad Soyad</h3>
          <p>{personel.adSoyad || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>T.C. No</h3>
          <p>{personel.tc || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Telefon</h3>
          <p>{personel.telefon || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Görev</h3>
          <p>{gorevEtiketi(aktifGorev)}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Birim</h3>
          <p>{personel.birimAdi || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Poliklinik</h3>
          <p>{personel.poliklinikIsmi || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>İşe Giriş Tarihi</h3>
          <p>{personel.iseGirisTarihi || "—"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Durum</h3>
          <p>{durumEtiketi(personel.durum || "GÖREVDE")}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <div className="mhrs-secondary-panel">
          <h3>Vardiya</h3>
          <p>{personel.vardiya || "Gündüz"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>İşe Giriş</h3>
          <p>{personel.mesaiBaslangic || "08:00"}</p>
        </div>

        <div className="mhrs-secondary-panel">
          <h3>Çıkış</h3>
          <p>{personel.mesaiBitis || "17:00"}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        {roleSpecificInfo.map((item, index) => (
          <div className="mhrs-secondary-panel" key={index}>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
<h1 style={{ color: "red" }}>YENI PERSONEL PANELI</h1>
      <div className="table-header" style={{ marginBottom: "14px" }}>
        <h3>📋 Günlük Görevler</h3>
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Görev</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {gunlukGorevler.map((gorev, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{gorev}</td>
              <td>Aktif</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePersonel;