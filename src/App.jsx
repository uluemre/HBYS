import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

import { Login } from './components/login/index.jsx';
import { Sidebar } from './components/sidebar';
import ParkingLot from './components/ParkingLot';

import { TableRandevular, TableTahliller, TableYatislar, TableSikayet, TablePersonel } from './components/tables';
import { PatientProfileInfo, DoctorProfileInfo } from './components/profile/ProfileComponents';

import { HASTANELER, SAAT_SECENEKLERI } from './constants/hastaneler';
import { DOKTOR_LISTESI } from './constants/doktorlar';
import { formatTarih, normalizeText } from './utils/helpers';
import { useRandevuLogic } from './hooks/useRandevuLogic';

const BASE_URL = "http://192.168.233.106:8081/api";
const MAX_DENEME = 3;

export default function App() {

  // ─── Auth state ─────────────────────────────────────────────────────────────
  const [girisYapanKullanici, setGirisYapanKullanici] = useState(null);
  const [tcNo, setTcNo] = useState("");
  const [sifre, setSifre] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const [aktifSekme, setAktifSekme] = useState("Ana Sayfa");
  const [kayitModu, setKayitModu] = useState(false);
  const [denemeSayisi, setDenemeSayisi] = useState(0);
  const [isBanned] = useState(localStorage.getItem("system_ban") === "true");
  const [bulunanKonum, setBulunanKonum] = useState({ il: "", ilce: "", detay: "" });
  const [konumYukleniyor, setKonumYukleniyor] = useState(false);

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

  // ─── Randevu logic hook ──────────────────────────────────────────────────────
  const randevu = useRandevuLogic(girisYapanKullanici, setAktifSekme);

  // ─── Doktor demo kaydı eşleştirme ────────────────────────────────────────────
  const aktifDoktorDemoKaydi = (() => {
    if (!girisYapanKullanici || girisYapanKullanici.rol !== "DOKTOR") return null;
    const isimdenBul = DOKTOR_LISTESI.find(
      (d) => normalizeText(d.ad) === normalizeText(girisYapanKullanici.adSoyad)
    );
    if (isimdenBul) return isimdenBul;
    return DOKTOR_LISTESI.find(
      (d) =>
        normalizeText(d.poliklinik) ===
        normalizeText(girisYapanKullanici.poliklinikIsmi || girisYapanKullanici.brans || "")
    ) || null;
  })();

  // ─── Randevu özeti ────────────────────────────────────────────────────────────
  const seciliHastane = HASTANELER.find((h) => String(h.id) === String(randevu.hastaRandevuAkisi.hastaneId));
  const seciliDoktor = DOKTOR_LISTESI.find((d) => String(d.id) === String(randevu.hastaRandevuAkisi.doktorId));
  const seciliSlot = randevu.randevuSlotlari.find((s) => String(s.id) === String(randevu.hastaRandevuAkisi.slotId));
  const randevuOzeti =
    seciliHastane && seciliDoktor && seciliSlot
      ? { hastane: seciliHastane, doktor: seciliDoktor, slot: seciliSlot, poliklinik: randevu.hastaRandevuAkisi.poliklinik }
      : null;

  const goruntulenecekRandevular =
    girisYapanKullanici?.rol === "DOKTOR" && aktifDoktorDemoKaydi
      ? randevu.randevuListesi.filter((r) => Number(r.doktorId) === Number(aktifDoktorDemoKaydi.id))
      : randevu.randevuListesi;

  // ─── Giriş ────────────────────────────────────────────────────────────────────
  const handleGiris = async (e) => {
    if (e) e.preventDefault();
    setHataMesaji("");
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo, sifre }),
      });
      const result = await response.json();

      if (result.success) {
        setDenemeSayisi(0);
        const token = result.data?.token || result.token;
        if (!token) return setHataMesaji("Token hatası!");
        localStorage.setItem("token", token);

        const endpoint =
          result.data.rol === "DOKTOR" ? "/doktorlar/me" :
            result.data.rol === "PERSONEL" ? "/personel/me" :
              "/hastalar/me";

        const res = await fetch(`${BASE_URL}${endpoint}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (res.ok) {
          const kisi = await res.json();
          setGirisYapanKullanici({
            id: result.data.id,
            rol: result.data.rol,
            tc: result.data.tcNo,
            adSoyad: kisi.adSoyad || "—",
            cinsiyet: kisi.cinsiyet || null,
            kanGrubu: kisi.kanGrubu || null,
            telefon: kisi.telefon || null,
            adres: kisi.adres || null,
            dogumTarihi: kisi.dogumTarihi || null,
            unvan: kisi.unvan || null,
            brans: kisi.brans || kisi.uzmanlikAlani || null,
            uzmanlikAlani: kisi.uzmanlikAlani || null,
            poliklinikIsmi: kisi.poliklinikIsmi || null,
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
    } catch {
      setHataMesaji("Bağlantı hatası.");
    }
  };

  // ─── Kayıt ────────────────────────────────────────────────────────────────────
  const yeniHastaEkle = async (yeniHastaVerisi) => {
    setHataMesaji("");
    const kayitPaketi = {
      adSoyad: yeniHastaVerisi.adSoyad,
      tcNo: yeniHastaVerisi.tcNo,
      sifre: yeniHastaVerisi.sifre,
      telefon: yeniHastaVerisi.telefon,
      cinsiyet: yeniHastaVerisi.cinsiyet === "Erkek" ? "E" : "K",
      kanGrubu: yeniHastaVerisi.kanGrubu,
      adres: yeniHastaVerisi.adres,
      dogumTarihi: yeniHastaVerisi.dogumTarihi,
      rol: "HASTA",
    };
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kayitPaketi),
      });
      const responseText = await response.text();
      if (response.ok) {
        alert("✅ Kayıt Başarılı!");
        setKayitModu(false);
        setTcNo(yeniHastaVerisi.tcNo);
      } else {
        let hata = "Kayıt hatası.";
        try { hata = JSON.parse(responseText).message || hata; } catch { /* json parse hatası */ } setHataMesaji(`❌ ${hata}`);
      }
    } catch {
      setHataMesaji("❌ Bağlantı hatası.");
    }
  };

  // ─── Konum tespiti ────────────────────────────────────────────────────────────
  const konumuTespitEt = () => {
    setKonumYukleniyor(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address.province || data.address.city || "Ankara";
            setBulunanKonum({
              il: city,
              ilce: data.address.district || "Merkez",
              detay: `${data.address.suburb || ""} ${data.address.road || ""}`.trim(),
            });
            randevu.setRandevuAdimi("hastane-sec");
            randevu.setHastaRandevuAkisi((prev) => ({ ...prev, il: city, hastaneId: "", poliklinik: "", doktorId: "", slotId: "" }));
            setKonumYukleniyor(false);
          } catch {
            setKonumYukleniyor(false);
          }
        },
        () => setKonumYukleniyor(false)
      );
    }
  };

  // ─── Randevu akış render'ı ─────────────────────────────────────────────────
  const renderHastaRandevuAkisi = () => {
    const {
      randevuAdimi, hastaRandevuAkisi, randevuListesi,
      POLIKLINIKLER,
      geriGitRandevuAkisi, handleAramaTuruSec,
      handleHastaIlSec, handleHastaPoliklinikSec,
      handleHastaHastaneSec, handleHastaDoktorSec, handleHastaSlotSec,
      poliklinigeGoreUygunHastaneler, konumaGoreUygunHastaneler,
      hastaneyeGoreUygunPoliklinikler, hastaneVePoliklinigeGoreDoktorlar,
      doktoraVeHastaneyeGoreMusaitTarihler, doktoraVeHastaneyeGoreSaatler,
    } = randevu;

    const uygunHastaneler =
      hastaRandevuAkisi.aramaTuru === "poliklinik"
        ? poliklinigeGoreUygunHastaneler(hastaRandevuAkisi.poliklinik)
        : konumaGoreUygunHastaneler(hastaRandevuAkisi.il);

    const uygunPoliklinikler = hastaRandevuAkisi.hastaneId
      ? hastaneyeGoreUygunPoliklinikler(hastaRandevuAkisi.hastaneId)
      : POLIKLINIKLER;

    const uygunDoktorlar =
      hastaRandevuAkisi.hastaneId && hastaRandevuAkisi.poliklinik
        ? hastaneVePoliklinigeGoreDoktorlar(hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik)
        : [];

    // ── ANA EKRAN ──
    if (randevuAdimi === "ana") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-action-grid">
            <button className="mhrs-main-action-card hospital" onClick={() => randevu.setRandevuAdimi("arama-turu")}>
              <div className="mhrs-main-action-icon">🏥</div>
              <div>
                <h3>Hastaneden Randevu Al</h3>
                <p>Poliklinik veya konuma göre uygun hastane ve hekim seçin.</p>
              </div>
            </button>
            <div className="mhrs-secondary-panel">
              <h3>Yaklaşan Randevularım</h3>
              <p>
                {randevuListesi.length > 0
                  ? `${randevuListesi.length} adet randevu kaydınız görüntüleniyor.`
                  : "Yaklaşan randevunuz bulunmamaktadır."}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ── ARAMA TÜRÜ ──
    if (randevuAdimi === "arama-turu") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Hastaneden Randevu Al</h3>
          </div>
          <div className="mhrs-choice-grid">
            <button className="mhrs-choice-card poliklinik" onClick={() => handleAramaTuruSec("poliklinik", bulunanKonum)}>
              <span className="mhrs-choice-icon">📋</span>
              <span>Polikliniğe Göre</span>
            </button>
            <button className="mhrs-choice-card konum" onClick={() => handleAramaTuruSec("konum", bulunanKonum)}>
              <span className="mhrs-choice-icon">📍</span>
              <span>Konuma Göre</span>
            </button>
          </div>
        </div>
      );
    }

    // ── KONUM SEÇ ──
    if (randevuAdimi === "konum-sec") {
      const konumdakiHastaneler = bulunanKonum.il ? konumaGoreUygunHastaneler(bulunanKonum.il) : [];
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Konum Seçiniz</h3>
          </div>
          <div className="mhrs-list-panel">
            <div className="mhrs-inline-actions">
              <button className="login-submit-btn" onClick={konumuTespitEt} disabled={konumYukleniyor}>
                {konumYukleniyor ? "Konum Alınıyor..." : "📍 Mevcut Konumumu Kullan"}
              </button>
            </div>
            {bulunanKonum.il && (
              <div className="status-indicator" style={{ marginBottom: '14px' }}>
                Mevcut konum: <b>{bulunanKonum.il} / {bulunanKonum.ilce}</b><br />
                <small>{bulunanKonum.detay}</small>
              </div>
            )}
            {bulunanKonum.il && (
              <>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>
                  Konumunuza uygun hastaneler aşağıda listelendi:
                </div>
                {konumdakiHastaneler.length > 0
                  ? konumdakiHastaneler.map((hastane) => (
                    <button key={hastane.id} className="mhrs-hospital-card" onClick={() => handleHastaHastaneSec(hastane.id)}>
                      <div className="mhrs-hospital-header">
                        <div><h4>{hastane.ad}</h4><p>{hastane.il}</p></div>
                      </div>
                    </button>
                  ))
                  : <div className="mhrs-empty-state">Bu konumda uygun hastane bulunamadı.</div>
                }
                <div style={{ marginTop: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                    Farklı bir il seçmek isterseniz:
                  </label>
                  <select className="login-input" value={randevu.seciliIl} onChange={(e) => handleHastaIlSec(e.target.value)}>
                    <option value="">İl seçiniz</option>
                    {HASTANELER.map((h) => h.il).filter((v, i, arr) => arr.indexOf(v) === i).map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // ── POLİKLİNİK SEÇ ──
    if (randevuAdimi === "poliklinik-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Poliklinik Seçiniz</h3>
          </div>
          <div className="mhrs-list-panel">
            {uygunPoliklinikler.map((pol) => (
              <button key={pol} className="mhrs-list-card" onClick={() => handleHastaPoliklinikSec(pol)}>
                <div><h4>{pol}</h4><p>Bu alanda uygun hekimleri görüntüleyin.</p></div>
                <span>›</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ── HASTANE SEÇ ──
    if (randevuAdimi === "hastane-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Hastane Seçiniz</h3>
          </div>
          <div className="mhrs-list-panel">
            {uygunHastaneler.length > 0
              ? uygunHastaneler.map((hastane) => (
                <button key={hastane.id} className="mhrs-hospital-card" onClick={() => handleHastaHastaneSec(hastane.id)}>
                  <div className="mhrs-hospital-header">
                    <div><h4>{hastane.ad}</h4><p>{hastane.il}</p></div>
                  </div>
                  {hastaRandevuAkisi.aramaTuru === "poliklinik" && (
                    <div className="mhrs-hospital-meta">
                      <span>Poliklinik: {hastaRandevuAkisi.poliklinik}</span>
                    </div>
                  )}
                </button>
              ))
              : <div className="mhrs-empty-state">Seçtiğiniz kriterlere uygun hastane bulunamadı.</div>
            }
          </div>
        </div>
      );
    }

    // ── DOKTOR SEÇ ──
    if (randevuAdimi === "doktor-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Doktor Seçiniz</h3>
          </div>
          <div className="mhrs-list-panel">
            {uygunDoktorlar.length > 0
              ? uygunDoktorlar.map((doc) => (
                <button key={doc.id} className="mhrs-doctor-card" onClick={() => handleHastaDoktorSec(doc.id)}>
                  <div className="mhrs-doctor-left">
                    <div className="doc-avatar">👨‍⚕️</div>
                    <div>
                      <h4>{doc.ad}</h4>
                      <p>{doc.unvan}</p>
                      <small>{seciliHastane?.ad}</small>
                    </div>
                  </div>
                  <div className="mhrs-doctor-right">
                    <span className="mhrs-small-badge">Uygun {doc.uygunSlotSayisi}</span>
                    {doc.ilkMusaitSlot && (
                      <small>En yakın: {formatTarih(doc.ilkMusaitSlot.tarih)}</small>
                    )}
                  </div>
                </button>
              ))
              : <div className="mhrs-empty-state">Bu hastane ve poliklinikte müsait doktor bulunamadı.</div>
            }
          </div>
        </div>
      );
    }

    // ── SLOT SEÇ ──
    if (randevuAdimi === "slot-sec") {
      const tarihler = doktoraVeHastaneyeGoreMusaitTarihler(
        hastaRandevuAkisi.doktorId, hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik
      );
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Randevu Saati Seçiniz</h3>
          </div>
          <div className="mhrs-list-panel">
            {tarihler.map((tarih) => {
              const saatler = doktoraVeHastaneyeGoreSaatler(
                hastaRandevuAkisi.doktorId, hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik, tarih
              );
              return (
                <div key={tarih} className="mhrs-slot-group">
                  <div className="mhrs-slot-date">{formatTarih(tarih)}</div>
                  <div className="mhrs-slot-subtitle">
                    {hastaRandevuAkisi.poliklinik} • {seciliDoktor?.ad}
                  </div>
                  <div className="mhrs-slot-grid">
                    {saatler.map((slot) => (
                      <button key={slot.id} className="mhrs-slot-btn" onClick={() => handleHastaSlotSec(slot.id)}>
                        {slot.saat}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ── ONAY ──
    if (randevuAdimi === "onay" && randevuOzeti) {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Randevuyu Onayla</h3>
          </div>
          <div className="mhrs-confirm-card">
            <div className="mhrs-confirm-row"><span>Tarih</span><strong>{formatTarih(randevuOzeti.slot.tarih)}</strong></div>
            <div className="mhrs-confirm-row"><span>Saat</span><strong>{randevuOzeti.slot.saat}</strong></div>
            <div className="mhrs-confirm-divider" />
            <div className="mhrs-confirm-block">
              <p><b>Hastane:</b> {randevuOzeti.hastane.ad}</p>
              <p><b>Poliklinik:</b> {randevuOzeti.poliklinik}</p>
              <p><b>Doktor:</b> {randevuOzeti.doktor.ad}</p>
              <p><b>Randevu Sahibi:</b> {girisYapanKullanici.adSoyad}</p>
            </div>
          </div>
          <button className="mhrs-confirm-btn" onClick={() => randevu.handleRandevuAl(randevuOzeti)}>
            Randevuyu Onayla
          </button>
        </div>
      );
    }

    return null;
  };

  // ─── Render ────────────────────────────────────────────────────────────────────
  if (!girisYapanKullanici) {
    return (
      <Login
        handleGiris={handleGiris}
        tcNo={tcNo}
        setTcNo={setTcNo}
        sifre={sifre}
        setSifre={setSifre}
        hataMesaji={hataMesaji}
        kayitModu={kayitModu}
        setKayitModu={setKayitModu}
        geriDon={() => setKayitModu(false)}
        yeniHastaEkle={yeniHastaEkle}
        beklemeSuresi={beklemeSuresi}
        isBanned={isBanned}
      />
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        rol={girisYapanKullanici.rol}
        aktifSekme={aktifSekme}
        setAktifSekme={setAktifSekme}
        logout={() => {
          localStorage.removeItem("token");
          setGirisYapanKullanici(null);
          randevu.resetHastaRandevuAkisi();
        }}
      />

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
              {girisYapanKullanici.rol === "HASTA"
                ? renderHastaRandevuAkisi()
                : (
                  <div className="table-container">
                    <h3 style={{ marginBottom: '8px' }}>Sistem Özeti</h3>
                    <p style={{ color: '#64748b' }}>
                      Bu panel üzerinden profil, randevu ve çalışma takvimi işlemlerinizi yönetebilirsiniz.
                    </p>
                  </div>
                )
              }
            </>
          )}

          {aktifSekme === "Kişisel Bilgiler" && <PatientProfileInfo hasta={girisYapanKullanici} />}
          {aktifSekme === "Doktor Bilgileri" && <DoctorProfileInfo doktor={girisYapanKullanici} />}
          {aktifSekme === "Randevularım" && <TableRandevular veriler={goruntulenecekRandevular} />}
          {aktifSekme === "Tahlillerim" && <TableTahliller />}
          {aktifSekme === "Otopark Durumu" && <ParkingLot />}
          {aktifSekme === "Yatışlar" && <TableYatislar />}
          {aktifSekme === "Personel" && <TablePersonel />}
          {aktifSekme === "Şikayet/Öneri" && <TableSikayet />}

          {aktifSekme === "Çalışma Takvimi" && girisYapanKullanici.rol === "DOKTOR" && (
            <div className="table-container">
              <div className="table-header" style={{ marginBottom: '20px' }}>
                <h3>🗓️ Çalışma Takvimi Yönetimi</h3>
                <p style={{ color: '#64748b', marginTop: '8px' }}>
                  Hastane, gün ve saat seçerek kendi uygunluk planınızı oluşturun.
                </p>
              </div>
              {aktifDoktorDemoKaydi ? (
                <>
                  <div className="schedule-summary-card">
                    <h4>{aktifDoktorDemoKaydi.ad}</h4>
                    <p>{aktifDoktorDemoKaydi.unvan} • {aktifDoktorDemoKaydi.poliklinik}</p>
                  </div>
                  <div className="schedule-builder-card">
                    <div className="schedule-form-grid">
                      <div>
                        <label className="schedule-label">Hastane Seçiniz</label>
                        <div className="schedule-date-card">
                          <div className="schedule-date-input-wrap">
                            <span className="schedule-date-icon">🏥</span>
                            <select
                              className="schedule-date-input"
                              value={randevu.doktorTakvimFormu.hastaneId}
                              onChange={(e) =>
                                randevu.setDoktorTakvimFormu((prev) => ({ ...prev, hastaneId: e.target.value, seciliSaatler: [] }))
                              }
                            >
                              <option value="">Hastane seçiniz</option>
                              {HASTANELER.map((h) => (
                                <option key={h.id} value={h.id}>{h.ad}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="schedule-label">Gün Seçiniz</label>
                        <div className="schedule-date-card">
                          <div className="schedule-date-input-wrap">
                            <span className="schedule-date-icon">📅</span>
                            <input
                              type="date"
                              className="schedule-date-input"
                              value={randevu.doktorTakvimFormu.tarih}
                              onChange={(e) =>
                                randevu.setDoktorTakvimFormu((prev) => ({ ...prev, tarih: e.target.value, seciliSaatler: [] }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="schedule-label">Saat Seçiniz</label>
                      <div className="schedule-time-grid">
                        {SAAT_SECENEKLERI.map((saat) => (
                          <button
                            key={saat}
                            className={`schedule-time-chip ${randevu.doktorTakvimFormu.seciliSaatler.includes(saat) ? "active" : ""}`}
                            onClick={() =>
                              randevu.setDoktorTakvimFormu((prev) => ({
                                ...prev,
                                seciliSaatler: prev.seciliSaatler.includes(saat)
                                  ? prev.seciliSaatler.filter((s) => s !== saat)
                                  : [...prev.seciliSaatler, saat],
                              }))
                            }
                          >
                            {saat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="mhrs-confirm-btn" onClick={() => randevu.doktorSlotEkle(aktifDoktorDemoKaydi)}>
                      Slot Ekle
                    </button>
                  </div>

                  <table className="modern-table" style={{ marginTop: '24px' }}>
                    <thead>
                      <tr><th>Hastane</th><th>Tarih</th><th>Saat</th><th>Durum</th><th>İşlem</th></tr>
                    </thead>
                    <tbody>
                      {randevu.randevuSlotlari
                        .filter((slot) => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id))
                        .map((slot) => (
                          <tr key={slot.id}>
                            <td>{HASTANELER.find((h) => Number(h.id) === Number(slot.hastaneId))?.ad || "—"}</td>
                            <td>{formatTarih(slot.tarih)}</td>
                            <td>{slot.saat}</td>
                            <td>
                              <span className={`status-badge ${slot.durum === "MUSAIT" ? "status-active" : "status-pending"}`}>
                                {slot.durum}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => randevu.doktorSlotSil(slot.id)}
                                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      {randevu.randevuSlotlari.filter((slot) => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id)).length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                            Henüz tanımlanmış çalışma slotunuz bulunmuyor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="mhrs-empty-state">
                  Doktor kaydınız demo hekim listesiyle eşleşmediği için takvim ekranı açılamadı.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}