import { useState, useEffect } from 'react'
import './App.css'
import { Login } from './components/login'
import { Sidebar } from './components/sidebar'
import { 
  TableRandevular, TableTahliller, TableOtopark, 
  TableYatislar, TableSikayet, TablePersonel 
} from './components/tables'

const DoctorProfileInfo = ({ doktor }) => (
  <div className="profile-card-container doctor-theme">
    <div className="profile-header-main">
      <div className="profile-avatar-large">👨‍⚕️</div>
      <h3>{doktor.adSoyad || doktor.doktorAdSoyad || "Doktor Bilgisi Yok"}</h3> 
      <span className="badge-rol">SAĞLIK PERSONELİ</span>
    </div>
    <div className="profile-grid">
      <div className="profile-item"><strong>Ad Soyad</strong> <span>{doktor.adSoyad || doktor.doktorAdSoyad}</span></div>
      <div className="profile-item"><strong>T.C. Kimlik</strong> <span>{doktor.tc}</span></div>
      <div className="profile-item"><strong>Unvan</strong> <span>{doktor.unvan || "Uzman Doktor"}</span></div>
      <div className="profile-item"><strong>Uzmanlık Alanı</strong> <span>{doktor.uzmanlikAlani || doktor.brans || "Genel Poliklinik"}</span></div>
      <div className="profile-item"><strong>Poliklinik</strong> <span>{doktor.poliklinikIsmi || "Merkez Poliklinik"}</span></div>
      <div className="profile-item"><strong>Kurumsal E-Posta</strong> <span>{doktor.tc}@hastane.com</span></div>
    </div>
  </div>
);

const PatientProfileInfo = ({ hasta }) => (
  <div className="profile-card-container">
    <div className="profile-header-main">
      <div className="profile-avatar-large">👤</div>
      <h3>{hasta.adSoyad || hasta.hastaAdSoyad || "Hasta Bilgisi Yok"}</h3>
      <span className="badge-rol">{hasta.rol === 'PERSONEL' ? 'PERSONEL PROFİLİ' : 'HASTA PROFİLİ'}</span>
    </div>
    <div className="profile-grid">
      <div className="profile-item"><strong>Ad Soyad</strong> <span>{hasta.adSoyad || hasta.hastaAdSoyad}</span></div>
      <div className="profile-item"><strong>T.C. Kimlik</strong> <span>{hasta.tc}</span></div>
      {hasta.rol === 'PERSONEL' ? (
        <>
          <div className="profile-item"><strong>Telefon</strong> <span>{hasta.telefon || "Bilgi Yok"}</span></div>
          <div className="profile-item"><strong>Rol</strong> <span>{hasta.rol}</span></div>
          <div className="profile-item"><strong>İşe Giriş Tarihi</strong> <span>{hasta.iseGirisTarihi || "Belirtilmemiş"}</span></div>
        </>
      ) : (
        <>
          <div className="profile-item"><strong>Cinsiyet</strong> <span>{hasta.cinsiyet === 'E' ? 'Erkek' : 'Kadın'}</span></div>
          <div className="profile-item"><strong>Kan Grubu</strong> <span>{hasta.kanGrubu || "Belirtilmemiş"}</span></div>
          <div className="profile-item"><strong>Telefon</strong> <span>{hasta.telefon || "Bilgi Yok"}</span></div>
          <div className="profile-item full-width"><strong>Adres</strong> <span>{hasta.adres || "Bilgi Yok"}</span></div>
        </>
      )}
    </div>
  </div>
);

function App() {
  const MAX_DENEME = 3;
  const BASE_URL = "http://192.168.233.106:8081/api";

  const [girisYapanKullanici, setGirisYapanKullanici] = useState(null);
  const [tcNo, setTcNo] = useState("");
  const [sifre, setSifre] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const [aktifSekme, setAktifSekme] = useState("Ana Sayfa");
  const [kayitModu, setKayitModu] = useState(false);
  const [aramaModu, setAramaModu] = useState("genel"); 
  const [denemeSayisi, setDenemeSayisi] = useState(0);
  const [isBanned, setIsBanned] = useState(localStorage.getItem("system_ban") === "true");
  const [seciliIl, setSeciliIl] = useState("");
  const [seciliPoliklinik, setSeciliPoliklinik] = useState("");
  const [bulunanKonum, setBulunanKonum] = useState({ il: "", ilce: "", detay: "" });
  const [konumYukleniyor, setKonumYukleniyor] = useState(false);
  const [aramaSonuclari, setAramaSonuclari] = useState([]);
  const [doktorSecimleri, setDoktorSecimleri] = useState({});

  const [randevuListesi, setRandevuListesi] = useState(() => {
    const kaydedilmis = localStorage.getItem("hastane_randevular");
    return kaydedilmis ? JSON.parse(kaydedilmis) : [
      { id: "#1284", poliklinik: "Göz Hastalıkları", doktor: "Dr. Ali Bakış", doktorId: 5, tarih: "2026-03-05", saat: "10:30", durum: "ONAYLANDI", sikayet: "Sistem üzerinden randevu alındı." }
    ];
  });

  useEffect(() => {
    localStorage.setItem("hastane_randevular", JSON.stringify(randevuListesi));
  }, [randevuListesi]);

  const [beklemeSuresi, setBeklemeSuresi] = useState(() => {
    const savedUntil = localStorage.getItem("lock_until");
    if (savedUntil) {
      const remaining = Math.round((parseInt(savedUntil) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  useEffect(() => {
    let timer;
    if (beklemeSuresi > 0) {
      timer = setInterval(() => {
        setBeklemeSuresi((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("lock_until");
            setHataMesaji("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [beklemeSuresi]);

  const iller = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];
  const poliklinikler = ["Acil Servis", "Dahiliye (İç Hastalıkları)", "Göz Hastalıkları", "Kulak Burun Boğaz", "Kardiyoloji", "Ortopedi", "Kadın Doğum", "Pediatri", "Nöroloji", "Genel Cerrahi", "Üroloji", "Göğüs Hastalıkları", "Dermatoloji", "Psikiyatri", "Fizik Tedavi", "Enfeksiyon", "Endokrinoloji", "Gastroenteroloji", "Nefroloji", "Onkoloji"];
  const saatler = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const doktorHavuzu = {
    "Acil Servis": [{ id: 1, ad: "Dr. Ahmet Acil", unvan: "Uzm. Dr." }, { id: 2, ad: "Dr. Ayşe Kurtaran", unvan: "Uzm. Dr." }, { id: 42, ad: "Dr. Selim Aksoy", unvan: "Başhekim" }],
    "Dahiliye (İç Hastalıkları)": [{ id: 3, ad: "Dr. Mehmet İçel", unvan: "Doç. Dr." }, { id: 4, ad: "Dr. Fatma Dahil", unvan: "Uzm. Dr." }],
    "Göz Hastalıkları": [{ id: 5, ad: "Dr. Ali Bakış", unvan: "Prof. Dr." }, { id: 6, ad: "Dr. Nur Mercek", unvan: "Uzm. Dr." }],
    "Kulak Burun Boğaz": [{ id: 7, ad: "Dr. Hakan Duygu", unvan: "Doç. Dr." }, { id: 8, ad: "Dr. Seda Kulak", unvan: "Uzm. Dr." }],
    "Kardiyoloji": [{ id: 9, ad: "Dr. Ömer Kalp", unvan: "Prof. Dr." }, { id: 10, ad: "Dr. Arzu Damar", unvan: "Uzm. Dr." }],
    "Ortopedi": [{ id: 11, ad: "Dr. Kemal Kemik", unvan: "Doç. Dr." }, { id: 12, ad: "Dr. Sibel Alçı", unvan: "Uzm. Dr." }],
    "Kadın Doğum": [{ id: 13, ad: "Dr. Zeynep Bebek", unvan: "Prof. Dr." }, { id: 14, ad: "Dr. Canan Ana", unvan: "Uzm. Dr." }],
    "Pediatri": [{ id: 15, ad: "Dr. Can Çocuk", unvan: "Prof. Dr." }, { id: 16, ad: "Dr. Elif Kreş", unvan: "Uzm. Dr." }],
    "Nöroloji": [{ id: 17, ad: "Dr. Sinan Beyin", unvan: "Doç. Dr." }, { id: 18, ad: "Dr. Aslı Sinir", unvan: "Uzm. Dr." }],
    "Genel Cerrahi": [{ id: 19, ad: "Dr. Murat Bıçak", unvan: "Prof. Dr." }, { id: 20, ad: "Dr. Filiz Neşter", unvan: "Doç. Dr." }],
    "Üroloji": [{ id: 21, ad: "Dr. Mert Üro", unvan: "Uzm. Dr." }, { id: 22, ad: "Dr. Selim Böbrek", unvan: "Uzm. Dr." }],
    "Göğüs Hastalıkları": [{ id: 23, ad: "Dr. Yavuz Nefes", unvan: "Doç. Dr." }, { id: 24, ad: "Dr. Tülay Akciğer", unvan: "Uzm. Dr." }],
    "Dermatoloji": [{ id: 25, unvan: "Uzm. Dr." }, { id: 26, unvan: "Uzm. Dr." }],
    "Psikiyatri": [{ id: 27, ad: "Dr. Özgür Ruh", unvan: "Prof. Dr." }, { id: 28, ad: "Dr. Melis Terapi", unvan: "Uzm. Dr." }],
    "Fizik Tedavi": [{ id: 29, ad: "Dr. Burak Fizik", unvan: "Doç. Dr." }, { id: 30, ad: "Dr. Hale Hareket", unvan: "Uzm. Dr." }],
    "Enfeksiyon": [{ id: 31, ad: "Dr. Yavuz Mikrop", unvan: "Uzm. Dr." }, { id: 32, ad: "Dr. Selin Virüs", unvan: "Uzm. Dr." }],
    "Endokrinoloji": [{ id: 33, unvan: "Prof. Dr." }, { id: 34, unvan: "Uzm. Dr." }],
    "Gastroenteroloji": [{ id: 35, unvan: "Doç. Dr." }, { id: 36, unvan: "Uzm. Dr." }],
    "Nefroloji": [{ id: 37, unvan: "Prof. Dr." }, { id: 38, unvan: "Uzm. Dr." }],
    "Onkoloji": [{ id: 39, ad: "Dr. Berk Tümör", unvan: "Prof. Dr." }, { id: 40, ad: "Dr. Işıl Terapi", unvan: "Doç. Dr." }]
  };

  // ✅ HASTA KAYIT (BACKEND ANALİZİNE UYGUN)
  const yeniHastaEkle = async (yeniHastaVerisi) => {
  setHataMesaji("");
  const kayitPaketi = {
    adSoyad:     yeniHastaVerisi.adSoyad,
    tcNo:        yeniHastaVerisi.tcNo,
    sifre:       yeniHastaVerisi.sifre,
    telefon:     yeniHastaVerisi.telefon,
    cinsiyet:    yeniHastaVerisi.cinsiyet === "Erkek" ? "E" : "K",
    kanGrubu:    yeniHastaVerisi.kanGrubu,
    adres:       yeniHastaVerisi.adres,
    dogumTarihi: yeniHastaVerisi.dogumTarihi,
    rol:         "HASTA"
  };

  // DEBUG - console'da gönderilen paketi gör
  console.log("📤 Kayıt paketi:", JSON.stringify(kayitPaketi));

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kayitPaketi)
    });
    const responseText = await response.text();
    console.log("📥 Kayıt response:", responseText); // DEBUG

    if (response.ok) {
      alert("✅ Kayıt Başarılı!");
      setKayitModu(false);
      setTcNo(yeniHastaVerisi.tcNo);
    } else {
      let hata = "Kayıt hatası.";
      try { hata = JSON.parse(responseText).message || hata; } catch (_) {} //  github
      setHataMesaji(`❌ ${hata}`);
    }
  } catch (error) { setHataMesaji("❌ Bağlantı hatası."); }
};

  const handleRandevuAl = async (doktorBilgisi) => {
    const secim = doktorSecimleri[doktorBilgisi.id] || {};
    if (!secim.tarih || !secim.saat) return alert("Lütfen Tarih ve Saat seçiniz!");
    const cakisma = randevuListesi.some(r => r.tarih === secim.tarih && r.saat === secim.saat);
    if (cakisma) return alert("Hata: Bu tarih ve saatte zaten bir randevunuz bulunuyor!");

    const token = localStorage.getItem("token");
    const randevuPaketi = {
      doktorId: Number(doktorBilgisi.id),
      randevuTarihi: secim.tarih,
      randevuSaati: `${secim.saat}:00`,
      durum: "ONAYLANDI",
      sikayet: "Sistem üzerinden randevu alındı."
    };

    try {
      const response = await fetch(`${BASE_URL}/randevular`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(randevuPaketi)
      });

      if (response.ok) {
        const yeniRandevu = { id: `#${Math.floor(Math.random() * 9000) + 1000}`, poliklinik: seciliPoliklinik, doktor: doktorBilgisi.ad, doktorId: doktorBilgisi.id, tarih: secim.tarih, saat: secim.saat, durum: "ONAYLANDI", sikayet: "Sistem üzerinden randevu alındı." };
        setRandevuListesi([yeniRandevu, ...randevuListesi]);
        alert("✅ Randevu veritabanına başarıyla kaydedildi!");
        setDoktorSecimleri({ ...doktorSecimleri, [doktorBilgisi.id]: { tarih: "", saat: "" } });
        setAktifSekme("Randevularım");
      } else {
        const err = await response.json();
        alert(`DB Reddi: ${err.message || "Eksik Veri"}`);
      }
    } catch (err) { alert("Sunucu bağlantı hatası!"); }
  };

  // ✅ GİRİŞ (ARKADAŞININ İSTEDİĞİ TOKEN AKIŞI + TOLERANS MODU)
  const handleGiris = async (e) => {
    if (e) e.preventDefault();
    setHataMesaji(""); 
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tcNo, sifre })
      });

      const result = await response.json();

      if (result.success) {
        setDenemeSayisi(0);
        // Token yakalama (Backend loguna tam uyumlu)
        const token = result.data?.token || result.token;
        if (!token) return setHataMesaji("Token hatası!");
        localStorage.setItem("token", token);

        const endpoint = result.data.rol === "DOKTOR" ? "/doktorlar/me" : 
                         (result.data.rol === "PERSONEL" ? "/personel/me" : "/hastalar/me");

        // Arkadaşının istediği güvenli header yapısı
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          method: "GET",
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

      if (res.ok) {
  const kisi = await res.json();
  setGirisYapanKullanici({
    id:          result.data.id,
    rol:         result.data.rol,
    tc:          result.data.tcNo,
    adSoyad:     kisi.adSoyad    || "—",
    cinsiyet:    kisi.cinsiyet   || null,
    kanGrubu:    kisi.kanGrubu   || null,
    telefon:     kisi.telefon    || null,
    adres:       kisi.adres      || null,
    dogumTarihi: kisi.dogumTarihi|| null,
  });
  setAktifSekme("Ana Sayfa");
}
      } else {
        const yeniDeneme = denemeSayisi + 1;
        const kalanHak = MAX_DENEME - yeniDeneme;
        setDenemeSayisi(yeniDeneme);
        if (kalanHak > 0) {
          setHataMesaji(`❌ Hatalı T.C. veya şifre. Kalan hak: ${kalanHak}`);
        } else {
          setHataMesaji("⛔ 3 kez hatalı giriş. 120 saniye bekleyiniz.");
          localStorage.setItem("lock_until", (Date.now() + 120000).toString());
          setBeklemeSuresi(120);
          setDenemeSayisi(0);
        }
      }
    } catch (error) { setHataMesaji("Bağlantı hatası."); }
  };

  const konumuTespitEt = () => {
    setKonumYukleniyor(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.province || data.address.city || "Ankara";
          setBulunanKonum({ il: city, ilce: data.address.district || "Merkez", detay: `${data.address.suburb || ""} ${data.address.road || ""}`.trim() });
          setSeciliIl(city); setKonumYukleniyor(false);
        } catch (error) { setKonumYukleniyor(false); }
      }, () => { setKonumYukleniyor(false); });
    }
  };

  const doktorAra = () => {
    if (!seciliPoliklinik) return alert("Lütfen poliklinik seçiniz.");
    setAramaSonuclari(doktorHavuzu[seciliPoliklinik] || []);
  };

  const goruntulenecekRandevular = girisYapanKullanici?.rol === "DOKTOR" 
    ? randevuListesi.filter(r => Number(r.doktorId) === Number(girisYapanKullanici.id))
    : randevuListesi;

  if (!girisYapanKullanici)
    return (
      <Login
        handleGiris={handleGiris} tcNo={tcNo} setTcNo={setTcNo} sifre={sifre} setSifre={setSifre}
        hataMesaji={hataMesaji} kayitModu={kayitModu} setKayitModu={setKayitModu}
        geriDon={() => setKayitModu(false)} yeniHastaEkle={yeniHastaEkle}
        beklemeSuresi={beklemeSuresi} isBanned={isBanned}
      />
    );

  return (
    <div className="dashboard-wrapper">
      <Sidebar rol={girisYapanKullanici.rol} aktifSekme={aktifSekme} setAktifSekme={setAktifSekme} logout={() => { localStorage.removeItem("token"); setGirisYapanKullanici(null); }} />
      <main className="main-content">
        <header className="content-header">
          <h2>{aktifSekme}</h2>
          <div className="user-info">
            <span className="user-name">{girisYapanKullanici.adSoyad}</span>
            <span className="user-role-tag">{girisYapanKullanici.rol}</span>
          </div>
        </header>

        <div className="tab-content">
          {aktifSekme === "Ana Sayfa" && (
            <>
              <div className="mhrs-banner">Hoş Geldiniz, {girisYapanKullanici.adSoyad}</div>
              {girisYapanKullanici.rol === "HASTA" && (
                <div className="randevu-arama-panel">
                  <div className="arama-nav">
                    <button className={`nav-btn ${aramaModu === "genel" ? "active" : ""}`} onClick={() => setAramaModu("genel")}>🔍 Genel Arama</button>
                    <button className={`nav-btn ${aramaModu === "konum" ? "active" : ""}`} onClick={() => setAramaModu("konum")}>📍 Konuma Göre</button>
                  </div>
                  <div className="arama-form-box">
                    {aramaModu === "genel" ? (
                      <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px' }}>
                        <select className="login-input" value={seciliIl} onChange={(e) => setSeciliIl(e.target.value)}>
                          <option value="">İl Seçiniz</option>
                          {iller.map(il => <option key={il} value={il}>{il}</option>)}
                        </select>
                        <select className="login-input" value={seciliPoliklinik} onChange={(e) => setSeciliPoliklinik(e.target.value)}>
                          <option value="">Poliklinik Seçiniz</option>
                          {poliklinikler.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button className="login-submit-btn" onClick={doktorAra}>Doktor Ara</button>
                      </div>
                    ) : (
                      <div className="location-box">
                        {bulunanKonum.il ? (
                          <div className="status-indicator">
                            📍 Mevcut konum: <b>{bulunanKonum.il} / {bulunanKonum.ilce}</b><br />
                            <small>{bulunanKonum.detay}</small>
                            <select className="login-input" onChange={(e) => setSeciliPoliklinik(e.target.value)}>
                              <option value="">Bölgedeki Poliklinikler</option>
                              {poliklinikler.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button className="login-submit-btn" onClick={doktorAra}>Bana En Yakın Doktoru Bul</button>
                          </div>
                        ) : (
                          <button className="login-submit-btn" onClick={konumuTespitEt} disabled={konumYukleniyor}>{konumYukleniyor ? "Alınıyor..." : "📍 Konumumu Bul"}</button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="results-section" style={{ marginTop: '20px' }}>
                    {aramaSonuclari.map((doc, idx) => (
                      <div className="doctor-result-card" key={idx} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #eef2f3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                          <div className="doc-avatar" style={{ fontSize: '2rem', marginRight: '15px' }}>👨‍⚕️</div>
                          <div className="doc-details">
                            <h4>{doc.ad}</h4>
                            <p>{doc.unvan} - {seciliPoliklinik}</p>
                          </div>
                        </div>
                        <div className="appointment-picker" style={{ display: 'flex', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', alignItems: 'flex-end' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a5f7a', display: 'block', marginBottom: '5px' }}>📅 Tarih</label>
                            <input type="date" className="login-input" value={doktorSecimleri[doc.id]?.tarih || ""} onChange={(e) => setDoktorSecimleri({ ...doktorSecimleri, [doc.id]: { ...(doktorSecimleri[doc.id] || {}), tarih: e.target.value } })} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1a5f7a', display: 'block', marginBottom: '5px' }}>🕒 Saat</label>
                            <select className="login-input" value={doktorSecimleri[doc.id]?.saat || ""} onChange={(e) => setDoktorSecimleri({ ...doktorSecimleri, [doc.id]: { ...(doktorSecimleri[doc.id] || {}), saat: e.target.value } })}>
                              <option value="">Saat Seç</option>
                              {saatler.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <button className="randevu-sec-btn" style={{ background: '#1a5f7a', color: 'white', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', height: '45px' }} onClick={() => handleRandevuAl(doc)}>Randevu Al</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {aktifSekme === "Kişisel Bilgiler" && <PatientProfileInfo hasta={girisYapanKullanici} />}
          {aktifSekme === "Doktor Bilgileri" && <DoctorProfileInfo doktor={girisYapanKullanici} />}
          {aktifSekme === "Randevularım" && <TableRandevular veriler={randevuListesi} tcNo={girisYapanKullanici.tc} />}
          {aktifSekme === "Tahlillerim" && <TableTahliller tcNo={girisYapanKullanici.tc} />}
          {aktifSekme === "Otopark" && <TableOtopark />}
          {aktifSekme === "Yatışlar" && <TableYatislar />}
          {aktifSekme === "Personel" && <TablePersonel />}
          {aktifSekme === "Şikayet/Öneri" && <TableSikayet />}
        </div>
      </main>
    </div>
  );
}

export default App;