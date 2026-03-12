import { useState, useEffect, useMemo } from 'react';
import './App.css';

import { Login } from './components/login/index.jsx';
import { Sidebar } from './components/sidebar';
import ParkingLot from './components/ParkingLot';

import { TableRandevular, TableTahliller, TableYatislar, TableSikayet, TablePersonel } from './components/tables';
import { PatientProfileInfo, DoctorProfileInfo } from './components/profile/ProfileComponents';

import { HASTANELER, SAAT_SECENEKLERI, BASHEKIM_DEMO_NOBETLERI, BASHEKIM_DEMO_SIKAYETLERI, TETKIK_SABLONLARI } from './constants/hastaneler';
import { DOKTOR_LISTESI, DOKTOR_HAVUZU } from './constants/doktorlar';
import { formatTarih, normalizeText, slotSirala, hesaplaMesafeKm, createInitialSlots, futureDate } from './utils/helpers';

const BASE_URL = "http://192.168.233.106:8081/api";
const MAX_DENEME = 3;

export default function App() {
  const bugunString = new Date().toISOString().split('T')[0];

  // ─── Auth state ───────────────────────────────────────────────────────────────
  const [girisYapanKullanici, setGirisYapanKullanici] = useState(null);
  const [tcNo, setTcNo] = useState("");
  const [sifre, setSifre] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const [aktifSekme, setAktifSekme] = useState("Ana Sayfa");
  const [kayitModu, setKayitModu] = useState(false);
  const [denemeSayisi, setDenemeSayisi] = useState(0);
  const [isBanned] = useState(localStorage.getItem("system_ban") === "true");
  const [seciliIl, setSeciliIl] = useState("");
  const [, setSeciliPoliklinik] = useState("");
  const [bulunanKonum, setBulunanKonum] = useState({ il: "", ilce: "", detay: "", latitude: null, longitude: null });
  const [konumYukleniyor, setKonumYukleniyor] = useState(false);
  const [, setAramaSonuclari] = useState([]);

  // ─── Randevu akış state ───────────────────────────────────────────────────────
  const [randevuAdimi, setRandevuAdimi] = useState("ana");
  const [hastaRandevuAkisi, setHastaRandevuAkisi] = useState({
    aramaTuru: "", il: "", poliklinik: "", hastaneId: "", doktorId: "", slotId: ""
  });

  // ─── Doktor takvim state ──────────────────────────────────────────────────────
  const [doktorTakvimFormu, setDoktorTakvimFormu] = useState({
    hastaneId: "", tarih: "", seciliSaatler: []
  });

  // ─── Randevu / slot state ─────────────────────────────────────────────────────
  const [randevuListesi, setRandevuListesi] = useState(() => {
    const kaydedilmis = localStorage.getItem("hastane_randevular");
    return kaydedilmis ? JSON.parse(kaydedilmis) : [
      {
        id: "#1284", hastaId: 1, poliklinik: "Göz Hastalıkları",
        doktor: "Dr. Ali Bakış", doktorId: 5, hastane: "İstanbul Şehir Hastanesi",
        tarih: futureDate(1), saat: "10:30", durum: "ONAYLANDI",
        sikayet: "Sistem üzerinden randevu alındı."
      }
    ];
  });

  const [randevuSlotlari, setRandevuSlotlari] = useState(() => {
    const kaydedilmis = localStorage.getItem("hastane_randevu_slotlari");
    return kaydedilmis ? JSON.parse(kaydedilmis) : createInitialSlots();
  });

  // ─── Muayene / tahlil / reçete state ─────────────────────────────────────────
  const [muayeneKayitlari, setMuayeneKayitlari] = useState(() => {
    const kayit = localStorage.getItem("muayene_kayitlari");
    return kayit ? JSON.parse(kayit) : [];
  });

  const [tahlilIstekleri, setTahlilIstekleri] = useState(() => {
    const kayit = localStorage.getItem("tahlil_istekleri");
    return kayit ? JSON.parse(kayit) : [];
  });

  const [tahlilSonuclari, setTahlilSonuclari] = useState(() => {
    const kayit = localStorage.getItem("tahlil_sonuclari");
    return kayit ? JSON.parse(kayit) : [];
  });

  const [receteler, setReceteler] = useState(() => {
    const kayit = localStorage.getItem("receteler");
    return kayit ? JSON.parse(kayit) : [];
  });

  // ─── localStorage sync ───────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("hastane_randevular", JSON.stringify(randevuListesi)); }, [randevuListesi]);
  useEffect(() => { localStorage.setItem("hastane_randevu_slotlari", JSON.stringify(randevuSlotlari)); }, [randevuSlotlari]);
  useEffect(() => { localStorage.setItem("muayene_kayitlari", JSON.stringify(muayeneKayitlari)); }, [muayeneKayitlari]);
  useEffect(() => { localStorage.setItem("tahlil_istekleri", JSON.stringify(tahlilIstekleri)); }, [tahlilIstekleri]);
  useEffect(() => { localStorage.setItem("tahlil_sonuclari", JSON.stringify(tahlilSonuclari)); }, [tahlilSonuclari]);
  useEffect(() => { localStorage.setItem("receteler", JSON.stringify(receteler)); }, [receteler]);

  // ─── Bekleme süresi ───────────────────────────────────────────────────────────
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
          if (prev <= 1) { localStorage.removeItem("lock_until"); setHataMesaji(""); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [beklemeSuresi]);

  // ─── Doktor demo kaydı ────────────────────────────────────────────────────────
  const aktifDoktorDemoKaydi = (() => {
    if (!girisYapanKullanici || (girisYapanKullanici.rol !== "DOKTOR" && girisYapanKullanici.rol !== "BASHEKIM")) return null;
    const isimdenBul = DOKTOR_LISTESI.find(d => normalizeText(d.ad) === normalizeText(girisYapanKullanici.adSoyad));
    if (isimdenBul) return isimdenBul;
    return DOKTOR_LISTESI.find(d =>
      normalizeText(d.poliklinik) === normalizeText(girisYapanKullanici.poliklinikIsmi || girisYapanKullanici.brans || "")
    ) || null;
  })();

  // ─── Randevu özeti ────────────────────────────────────────────────────────────
  const seciliHastane = HASTANELER.find(h => String(h.id) === String(hastaRandevuAkisi.hastaneId));
  const seciliDoktor = DOKTOR_LISTESI.find(d => String(d.id) === String(hastaRandevuAkisi.doktorId));
  const seciliSlot = randevuSlotlari.find(s => String(s.id) === String(hastaRandevuAkisi.slotId));
  const randevuOzeti = seciliHastane && seciliDoktor && seciliSlot
    ? { hastane: seciliHastane, doktor: seciliDoktor, slot: seciliSlot, poliklinik: hastaRandevuAkisi.poliklinik }
    : null;

  // ─── Slot sorgu fonksiyonları ─────────────────────────────────────────────────
  const doktoraAitMusaitSlotlar = (doktorId, hastaneId = null, poliklinik = null) => {
    return randevuSlotlari
      .filter(slot =>
        Number(slot.doktorId) === Number(doktorId) &&
        slot.durum === "MUSAIT" &&
        slot.tarih >= bugunString &&
        (!hastaneId || Number(slot.hastaneId) === Number(hastaneId)) &&
        (!poliklinik || slot.poliklinik === poliklinik)
      ).sort(slotSirala);
  };

  const doktoraAitIlkMusaitSlot = (doktorId, hastaneId = null, poliklinik = null) => {
    const slotlar = doktoraAitMusaitSlotlar(doktorId, hastaneId, poliklinik);
    return slotlar.length > 0 ? slotlar[0] : null;
  };

  const hastaneyeGoreUygunPoliklinikler = (hastaneId) => {
    return [...new Set(
      randevuSlotlari
        .filter(slot => Number(slot.hastaneId) === Number(hastaneId) && slot.durum === "MUSAIT" && slot.tarih >= bugunString)
        .map(slot => slot.poliklinik)
    )].sort((a, b) => a.localeCompare(b, 'tr'));
  };

  const poliklinigeGoreUygunHastaneler = (poliklinik) => {
    return HASTANELER.filter(hastane =>
      randevuSlotlari.some(slot =>
        Number(slot.hastaneId) === Number(hastane.id) &&
        slot.poliklinik === poliklinik &&
        slot.durum === "MUSAIT" &&
        slot.tarih >= bugunString
      )
    );
  };

  const konumaGoreUygunHastaneler = (il) => {
    return HASTANELER.filter(hastane =>
      hastane.il === il &&
      randevuSlotlari.some(slot =>
        Number(slot.hastaneId) === Number(hastane.id) && slot.durum === "MUSAIT" && slot.tarih >= bugunString
      )
    );
  };

  const konumaGoreSiraliHastaneler = (il) => {
    const uygunlar = konumaGoreUygunHastaneler(il);
    if (typeof bulunanKonum.latitude !== "number" || typeof bulunanKonum.longitude !== "number") {
      return uygunlar.map((hastane, index) => ({ ...hastane, mesafeKm: null, enYakinMi: index === 0 }));
    }
    const zenginlestirilmis = uygunlar.map(hastane => ({
      ...hastane,
      mesafeKm: hesaplaMesafeKm(bulunanKonum.latitude, bulunanKonum.longitude, hastane.lat, hastane.lon)
    }));
    const sirali = [...zenginlestirilmis].sort((a, b) => {
      if (a.mesafeKm == null) return 1;
      if (b.mesafeKm == null) return -1;
      return a.mesafeKm - b.mesafeKm;
    });
    return sirali.map((h, index) => ({ ...h, enYakinMi: index === 0 }));
  };

  const hastaneVePoliklinigeGoreDoktorlar = (hastaneId, poliklinik) => {
    return (DOKTOR_HAVUZU[poliklinik] || [])
      .filter(doc =>
        randevuSlotlari.some(slot =>
          Number(slot.hastaneId) === Number(hastaneId) &&
          Number(slot.doktorId) === Number(doc.id) &&
          slot.poliklinik === poliklinik &&
          slot.durum === "MUSAIT" &&
          slot.tarih >= bugunString
        )
      )
      .map(doc => ({
        ...doc,
        uygunSlotSayisi: doktoraAitMusaitSlotlar(doc.id, hastaneId, poliklinik).length,
        ilkMusaitSlot: doktoraAitIlkMusaitSlot(doc.id, hastaneId, poliklinik)
      }));
  };

  const doktoraVeHastaneyeGoreMusaitTarihler = (doktorId, hastaneId, poliklinik) => {
    const slotlar = doktoraAitMusaitSlotlar(doktorId, hastaneId, poliklinik);
    return [...new Set(slotlar.map(slot => slot.tarih))];
  };

  const doktoraVeHastaneyeGoreSaatler = (doktorId, hastaneId, poliklinik, secilenTarih) => {
    if (!secilenTarih) return [];
    return randevuSlotlari
      .filter(slot =>
        Number(slot.hastaneId) === Number(hastaneId) &&
        Number(slot.doktorId) === Number(doktorId) &&
        slot.poliklinik === poliklinik &&
        slot.tarih === secilenTarih &&
        slot.durum === "MUSAIT"
      ).sort(slotSirala);
  };

  // ─── Randevu akış handler'ları ────────────────────────────────────────────────
  const resetHastaRandevuAkisi = () => {
    setHastaRandevuAkisi({ aramaTuru: "", il: "", poliklinik: "", hastaneId: "", doktorId: "", slotId: "" });
    setRandevuAdimi("ana");
    setSeciliIl("");
    setSeciliPoliklinik("");
    setAramaSonuclari([]);
  };

  const geriGitRandevuAkisi = () => {
    if (randevuAdimi === "arama-turu") return setRandevuAdimi("ana");
    if (randevuAdimi === "konum-sec") return setRandevuAdimi("arama-turu");
    if (randevuAdimi === "hastane-sec") return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "konum-sec" : "poliklinik-sec");
    if (randevuAdimi === "poliklinik-sec") return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "hastane-sec" : "arama-turu");
    if (randevuAdimi === "doktor-sec") return setRandevuAdimi("poliklinik-sec");
    if (randevuAdimi === "slot-sec") return setRandevuAdimi("doktor-sec");
    if (randevuAdimi === "onay") return setRandevuAdimi("slot-sec");
  };

  const handleAramaTuruSec = (tur) => {
    setHastaRandevuAkisi({
      aramaTuru: tur,
      il: tur === "konum" ? (bulunanKonum.il || seciliIl || "") : "",
      poliklinik: "", hastaneId: "", doktorId: "", slotId: ""
    });
    setRandevuAdimi(tur === "konum" ? "konum-sec" : "poliklinik-sec");
  };

  const handleHastaIlSec = (il) => {
    setSeciliIl(il);
    setHastaRandevuAkisi(prev => ({ ...prev, il, hastaneId: "", poliklinik: "", doktorId: "", slotId: "" }));
    setRandevuAdimi("hastane-sec");
  };

  const handleHastaPoliklinikSec = (poliklinik) => {
    setSeciliPoliklinik(poliklinik);
    setHastaRandevuAkisi(prev => ({ ...prev, poliklinik, doktorId: "", slotId: "" }));
    setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "poliklinik" ? "hastane-sec" : "doktor-sec");
  };

  const handleHastaHastaneSec = (hastaneId) => {
    setHastaRandevuAkisi(prev => ({
      ...prev, hastaneId, doktorId: "", slotId: "",
      ...(prev.aramaTuru === "konum" ? { poliklinik: "" } : {})
    }));
    setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "poliklinik-sec" : "doktor-sec");
  };

  const handleHastaDoktorSec = (doktorId) => {
    setHastaRandevuAkisi(prev => ({ ...prev, doktorId, slotId: "" }));
    setRandevuAdimi("slot-sec");
  };

  const handleHastaSlotSec = (slotId) => {
    setHastaRandevuAkisi(prev => ({ ...prev, slotId }));
    setRandevuAdimi("onay");
  };

  // ─── Giriş ────────────────────────────────────────────────────────────────────
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
        const token = result.data?.token || result.token;
        if (!token) return setHataMesaji("Token hatası!");
        localStorage.setItem("token", token);
        const rol = result.data.rol;
        const endpoint =
          rol === "DOKTOR" ? "/doktorlar/me" :
            rol === "PERSONEL" ? "/personel/me" :
              rol === "BASHEKIM" ? "/bashekim/me" :
                "/hastalar/me";
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const kisi = await res.json();
          setGirisYapanKullanici({
            id: result.data.id, rol, tc: result.data.tcNo,
            adSoyad: kisi.adSoyad || "—",
            cinsiyet: kisi.cinsiyet || null,
            kanGrubu: kisi.kanGrubu || null,
            telefon: kisi.telefon || null,
            adres: kisi.adres || null,
            dogumTarihi: kisi.dogumTarihi || null,
            unvan: kisi.unvan || (rol === "BASHEKIM" ? "Başhekim" : null),
            brans: kisi.brans || kisi.uzmanlikAlani || null,
            uzmanlikAlani: kisi.uzmanlikAlani || null,
            poliklinikIsmi: kisi.poliklinikIsmi || null,
            iseGirisTarihi: kisi.iseGirisTarihi || null
          });
          setAktifSekme("Ana Sayfa");
        } else {
          setHataMesaji("Profil bilgileri alınamadı.");
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
      adSoyad: yeniHastaVerisi.adSoyad, tcNo: yeniHastaVerisi.tcNo, sifre: yeniHastaVerisi.sifre,
      telefon: yeniHastaVerisi.telefon, cinsiyet: yeniHastaVerisi.cinsiyet === "Erkek" ? "E" : "K",
      kanGrubu: yeniHastaVerisi.kanGrubu, adres: yeniHastaVerisi.adres,
      dogumTarihi: yeniHastaVerisi.dogumTarihi, rol: "HASTA"
    };
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kayitPaketi)
      });
      const responseText = await response.text();
      if (response.ok) {
        alert("✅ Kayıt Başarılı!");
        setKayitModu(false);
        setTcNo(yeniHastaVerisi.tcNo);
      } else {
        let hata = "Kayıt hatası.";
        try { hata = JSON.parse(responseText).message || hata; } catch { /* json parse hatası */ }
        setHataMesaji(`❌ ${hata}`);
      }
    } catch {
      setHataMesaji("❌ Bağlantı hatası.");
    }
  };

  // ─── Randevu al ───────────────────────────────────────────────────────────────
  const handleRandevuAl = async () => {
    if (!randevuOzeti) return alert("Randevu özeti oluşturulamadı.");
    const token = localStorage.getItem("token");
    const ayniSlotDoluMu = randevuSlotlari.find(
      slot => Number(slot.id) === Number(randevuOzeti.slot.id) && slot.durum !== "MUSAIT"
    );
    if (ayniSlotDoluMu) return alert("Bu slot artık uygun değil. Lütfen tekrar seçim yapınız.");
    const randevuPaketi = {
      doktorId: Number(randevuOzeti.doktor.id),
      randevuTarihi: randevuOzeti.slot.tarih,
      randevuSaati: `${randevuOzeti.slot.saat}:00`,
      durum: "ONAYLANDI",
      sikayet: "Sistem üzerinden randevu alındı."
    };
    try {
      const response = await fetch(`${BASE_URL}/randevular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(randevuPaketi)
      });
      if (response.ok) {
        const yeniRandevu = {
          // eslint-disable-next-line react-hooks/purity
          id: `#${Date.now()}`, hastaId: Number(girisYapanKullanici?.id || 1),
          poliklinik: randevuOzeti.poliklinik,
          doktor: randevuOzeti.doktor.ad,
          doktorId: randevuOzeti.doktor.id,
          hastane: randevuOzeti.hastane.ad,
          tarih: randevuOzeti.slot.tarih,
          saat: randevuOzeti.slot.saat,
          durum: "ONAYLANDI",
          sikayet: "Sistem üzerinden randevu alındı."
        };
        setRandevuListesi([yeniRandevu, ...randevuListesi]);
        setRandevuSlotlari(prev =>
          prev.map(slot => Number(slot.id) === Number(randevuOzeti.slot.id) ? { ...slot, durum: "DOLU" } : slot)
        );
        alert("✅ Randevunuz başarıyla oluşturuldu!");
        resetHastaRandevuAkisi();
        setAktifSekme("Randevularım");
      } else {
        const err = await response.json();
        alert(`DB Reddi: ${err.message || "Eksik Veri"}`);
      }
    } catch {
      alert("Sunucu bağlantı hatası!");
    }
  };

  // ─── Konum tespiti ────────────────────────────────────────────────────────────
  const konumuTespitEt = () => {
    setKonumYukleniyor(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.province || data.address.city || "Ankara";
          const district = data.address.district || data.address.town || "Merkez";
          setBulunanKonum({
            il: city, ilce: district,
            detay: `${data.address.suburb || ""} ${data.address.road || ""}`.trim(),
            latitude, longitude
          });
          setSeciliIl(city);
          setHastaRandevuAkisi(prev => ({ ...prev, il: city, hastaneId: "", poliklinik: "", doktorId: "", slotId: "" }));
          setRandevuAdimi("hastane-sec");
          setKonumYukleniyor(false);
        } catch {
          setKonumYukleniyor(false);
          alert("Konum bilgisi alınırken hata oluştu.");
        }
      }, () => { setKonumYukleniyor(false); alert("Konum erişimi reddedildi."); });
    } else {
      setKonumYukleniyor(false);
      alert("Tarayıcı konum özelliğini desteklemiyor.");
    }
  };

  // ─── Doktor takvim fonksiyonları ──────────────────────────────────────────────
  const doktorSaatSeciminiDegistir = (saat) => {
    setDoktorTakvimFormu(prev => {
      const seciliMi = prev.seciliSaatler.includes(saat);
      return {
        ...prev,
        seciliSaatler: seciliMi
          ? prev.seciliSaatler.filter(item => item !== saat)
          : [...prev.seciliSaatler, saat].sort((a, b) => new Date(`2000-01-01T${a}`) - new Date(`2000-01-01T${b}`))
      };
    });
  };

  const doktorTakvimeSlotEkle = () => {
    if (!aktifDoktorDemoKaydi) return alert("Doktor kaydınız demo listesi ile eşleşmedi.");
    if (!doktorTakvimFormu.hastaneId || !doktorTakvimFormu.tarih || doktorTakvimFormu.seciliSaatler.length === 0)
      return alert("Lütfen hastane, tarih ve en az bir saat seçiniz.");
    const mevcutSaatler = randevuSlotlari
      .filter(slot =>
        Number(slot.hastaneId) === Number(doktorTakvimFormu.hastaneId) &&
        Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id) &&
        slot.tarih === doktorTakvimFormu.tarih
      ).map(slot => slot.saat);
    const yeniSaatler = doktorTakvimFormu.seciliSaatler.filter(saat => !mevcutSaatler.includes(saat));
    if (yeniSaatler.length === 0) return alert("Seçtiğiniz saatlerin tamamı zaten eklenmiş.");
    const yeniSlotlar = yeniSaatler.map((saat, index) => ({
      id: Date.now() + index,
      hastaneId: Number(doktorTakvimFormu.hastaneId),
      doktorId: Number(aktifDoktorDemoKaydi.id),
      poliklinik: aktifDoktorDemoKaydi.poliklinik,
      tarih: doktorTakvimFormu.tarih, saat, durum: "MUSAIT"
    }));
    setRandevuSlotlari(prev => [...prev, ...yeniSlotlar].sort(slotSirala));
    const eklenemeyenSaatler = doktorTakvimFormu.seciliSaatler.filter(saat => mevcutSaatler.includes(saat));
    setDoktorTakvimFormu(prev => ({ ...prev, seciliSaatler: [] }));
    if (eklenemeyenSaatler.length > 0) {
      alert(`✅ ${yeniSaatler.length} slot eklendi.\n⚠️ Zaten kayıtlı: ${eklenemeyenSaatler.join(", ")}`);
    } else {
      alert(`✅ ${yeniSaatler.length} slot başarıyla eklendi.`);
    }
  };

  const doktorSlotSil = (slotId) => {
    setRandevuSlotlari(prev => prev.filter(slot => Number(slot.id) !== Number(slotId)));
  };

  // ─── Muayene akış fonksiyonları ───────────────────────────────────────────────
  const hastaGeldiIsaretle = (randevuId) => {
    setRandevuListesi(prev => prev.map(r => String(r.id) === String(randevuId) ? { ...r, durum: "HASTA_GELDI" } : r));
  };

  const muayeneBaslat = (randevu) => {
    const mevcutMuayene = muayeneKayitlari.find(m => String(m.randevuId) === String(randevu.id));
    if (mevcutMuayene) {
      setRandevuListesi(prev => prev.map(item => String(item.id) === String(randevu.id) ? { ...item, durum: "MUAYENEDE" } : item));
      return;
    }
    const yeniMuayene = {
      id: `MUA-${Date.now()}`, randevuId: randevu.id,
      hastaId: Number(randevu.hastaId || 1), doktorId: Number(randevu.doktorId),
      poliklinik: randevu.poliklinik, baslangicZamani: new Date().toISOString(),
      bitisZamani: null, sikayet: randevu.sikayet || "Muayene sırasında değerlendirilecek.",
      onTani: "Ön değerlendirme aşamasında", doktorNotu: "Muayene başlatıldı.", durum: "MUAYENEDE"
    };
    setMuayeneKayitlari(prev => [yeniMuayene, ...prev]);
    setRandevuListesi(prev => prev.map(item => String(item.id) === String(randevu.id) ? { ...item, durum: "MUAYENEDE" } : item));
  };

  const tahlilIste = (randevu) => {
    const muayene = muayeneKayitlari.find(m => String(m.randevuId) === String(randevu.id));
    if (!muayene) return alert("Önce muayeneyi başlatmalısınız.");
    const mevcutTahliller = tahlilIstekleri.filter(t => String(t.muayeneId) === String(muayene.id));
    if (mevcutTahliller.length > 0) return alert("Bu muayene için tahlil zaten istenmiş.");
    const tetkikler = TETKIK_SABLONLARI[randevu.poliklinik] || ["Hemogram"];
    const yeniTahliller = tetkikler.map((tetkik, index) => ({
      id: `TAH-${Date.now()}-${index}`, muayeneId: muayene.id,
      hastaId: muayene.hastaId, doktorId: muayene.doktorId,
      tahlilTuru: tetkik, istekTarihi: bugunString, durum: "ISTENDI"
    }));
    setTahlilIstekleri(prev => [...yeniTahliller, ...prev]);
    setMuayeneKayitlari(prev => prev.map(item =>
      String(item.id) === String(muayene.id)
        ? { ...item, onTani: item.onTani === "Ön değerlendirme aşamasında" ? "Tetkik planlandı" : item.onTani, doktorNotu: `${item.doktorNotu} ${tetkikler.join(", ")} istendi.`, durum: "TAHLIL_ISTENDI" }
        : item
    ));
    setRandevuListesi(prev => prev.map(item => String(item.id) === String(randevu.id) ? { ...item, durum: "TAHLIL_BEKLENIYOR" } : item));
  };

  const numuneVerildiIsaretle = (muayeneId) => {
    setTahlilIstekleri(prev => prev.map(item => String(item.muayeneId) === String(muayeneId) ? { ...item, durum: "LABORATUVARDA" } : item));
    setMuayeneKayitlari(prev => prev.map(item => String(item.id) === String(muayeneId) ? { ...item, durum: "TAHLIL_BEKLENIYOR" } : item));
  };

  const ornekSonucUret = (tahlilTuru) => {
    const bank = {
      "Hemogram": { sonucOzeti: "Hemoglobin değeri düşük bulundu.", referansDurumu: "REFERANS_DISI", sonucDetaylari: [{ parametre: "Hemoglobin", deger: "10.8", birim: "g/dL", referans: "12 - 16", durum: "Düşük" }] },
      "Biyokimya": { sonucOzeti: "Biyokimya değerleri genel olarak normal.", referansDurumu: "NORMAL", sonucDetaylari: [{ parametre: "Glukoz", deger: "92", birim: "mg/dL", referans: "70 - 100", durum: "Normal" }] },
      "CRP": { sonucOzeti: "CRP hafif yüksek bulundu.", referansDurumu: "REFERANS_DISI", sonucDetaylari: [{ parametre: "CRP", deger: "8.2", birim: "mg/L", referans: "0 - 5", durum: "Yüksek" }] },
      "B12 Vitamini": { sonucOzeti: "B12 vitamini düşük bulundu.", referansDurumu: "REFERANS_DISI", sonucDetaylari: [{ parametre: "B12", deger: "180", birim: "pg/mL", referans: "200 - 900", durum: "Düşük" }] },
    };
    return bank[tahlilTuru] || { sonucOzeti: `${tahlilTuru} sonucu değerlendirildi.`, referansDurumu: "NORMAL", sonucDetaylari: [{ parametre: tahlilTuru, deger: "Normal", birim: "-", referans: "-", durum: "Normal" }] };
  };

  const tahlilSonucuHazirla = (muayeneId) => {
    const hedefTahliller = tahlilIstekleri.filter(t => String(t.muayeneId) === String(muayeneId));
    if (hedefTahliller.length === 0) return alert("Bu muayene için tahlil bulunamadı.");
    const yeniSonuclar = hedefTahliller
      .filter(t => !tahlilSonuclari.some(s => String(s.tahlilId) === String(t.id)))
      .map((tahlil, index) => {
        const demoSonuc = ornekSonucUret(tahlil.tahlilTuru);
        return { id: `SON-${Date.now()}-${index}`, tahlilId: tahlil.id, muayeneId, sonucTarihi: bugunString, ...demoSonuc };
      });
    if (yeniSonuclar.length === 0) return alert("Sonuçlar zaten oluşturulmuş.");
    setTahlilSonuclari(prev => [...yeniSonuclar, ...prev]);
    setTahlilIstekleri(prev => prev.map(item => String(item.muayeneId) === String(muayeneId) ? { ...item, durum: "SONUCLANDI" } : item));
    setMuayeneKayitlari(prev => prev.map(item => String(item.id) === String(muayeneId) ? { ...item, durum: "SONUC_INCELENIYOR" } : item));
  };

  const sonucuIncele = (muayeneId) => {
    setTahlilIstekleri(prev => prev.map(item => String(item.muayeneId) === String(muayeneId) ? { ...item, durum: "DOKTOR_INCELEDI" } : item));
    setMuayeneKayitlari(prev => prev.map(item =>
      String(item.id) === String(muayeneId)
        ? { ...item, doktorNotu: `${item.doktorNotu} Sonuçlar doktor tarafından değerlendirildi.`, durum: "DOKTOR_INCELEDI" }
        : item
    ));
  };

  const receteYaz = (muayeneId, poliklinik) => {
    const mevcutRecete = receteler.find(r => String(r.muayeneId) === String(muayeneId));
    if (mevcutRecete) return alert("Bu muayene için reçete zaten yazılmış.");
    const ilaclar =
      poliklinik === "Dahiliye (İç Hastalıkları)"
        ? [{ ilacAdi: "Demir İlacı", kullanim: "Günde 1 kez tok karnına", sure: "30 gün" }, { ilacAdi: "B12 Vitamini", kullanim: "Günde 1 kez", sure: "14 gün" }]
        : poliklinik === "Kardiyoloji"
          ? [{ ilacAdi: "Kalp Destek İlacı", kullanim: "Sabah 1 tablet", sure: "30 gün" }]
          : [{ ilacAdi: "Genel Destek İlacı", kullanim: "Günde 1 kez", sure: "7 gün" }];
    const muayene = muayeneKayitlari.find(m => String(m.id) === String(muayeneId));
    if (!muayene) return;
    setReceteler(prev => [{ id: `REC-${Date.now()}`, muayeneId, hastaId: muayene.hastaId, doktorId: muayene.doktorId, receteTarihi: bugunString, ilaclar, doktorNotu: "Tahlil sonucu sonrası reçete oluşturuldu." }, ...prev]);
    setMuayeneKayitlari(prev => prev.map(item => String(item.id) === String(muayeneId) ? { ...item, durum: "RECETE_YAZILDI" } : item));
  };

  const muayeneTamamla = (randevuId, muayeneId) => {
    setMuayeneKayitlari(prev => prev.map(item => String(item.id) === String(muayeneId) ? { ...item, bitisZamani: new Date().toISOString(), durum: "TAMAMLANDI" } : item));
    setRandevuListesi(prev => prev.map(item => String(item.id) === String(randevuId) ? { ...item, durum: "TAMAMLANDI" } : item));
  };

  // ─── useMemo hesaplamalar ─────────────────────────────────────────────────────
  const goruntulenecekRandevular = girisYapanKullanici?.rol === "DOKTOR" && aktifDoktorDemoKaydi
    ? randevuListesi.filter(r => Number(r.doktorId) === Number(aktifDoktorDemoKaydi.id))
    : randevuListesi;

  const hastayaAitTahlilGorunumu = useMemo(() => {
    if (!girisYapanKullanici || girisYapanKullanici.rol !== "HASTA") return [];
    const hastaId = Number(girisYapanKullanici.id);
    const ilgiliMuayeneler = muayeneKayitlari.filter(m => Number(m.hastaId) === hastaId);
    const satirlar = [];
    ilgiliMuayeneler.forEach(muayene => {
      const randevu = randevuListesi.find(r => String(r.id) === String(muayene.randevuId));
      const doktorKaydi = DOKTOR_LISTESI.find(d => Number(d.id) === Number(muayene.doktorId));
      const muayeneyeAitTahliller = tahlilIstekleri.filter(t => String(t.muayeneId) === String(muayene.id));
      muayeneyeAitTahliller.forEach(tahlil => {
        const sonuc = tahlilSonuclari.find(s => String(s.tahlilId) === String(tahlil.id));
        const recete = receteler.find(r => String(r.muayeneId) === String(muayene.id));
        satirlar.push({
          muayeneTarihi: randevu ? formatTarih(randevu.tarih) : "—",
          poliklinik: randevu?.poliklinik || muayene.poliklinik || "—",
          doktor: doktorKaydi?.ad || randevu?.doktor || "—",
          tahlilTuru: tahlil.tahlilTuru,
          sonucOzeti: sonuc?.sonucOzeti || "Sonuç bekleniyor",
          sonucTarihi: sonuc?.sonucTarihi ? formatTarih(sonuc.sonucTarihi) : "—",
          receteDurumu: recete ? "Reçete yazıldı" : "Henüz yazılmadı",
          durum: tahlil.durum
        });
      });
    });
    return satirlar.sort((a, b) => a.muayeneTarihi.localeCompare(b.muayeneTarihi)).reverse();
  }, [girisYapanKullanici, muayeneKayitlari, tahlilIstekleri, tahlilSonuclari, receteler, randevuListesi]);

  const doktoraAitMuayeneSurecleri = useMemo(() => {
    if (!girisYapanKullanici || girisYapanKullanici.rol !== "DOKTOR" || !aktifDoktorDemoKaydi) return [];
    const doktorId = Number(aktifDoktorDemoKaydi.id);
    return randevuListesi
      .filter(r => Number(r.doktorId) === doktorId)
      .map(randevu => {
        const muayene = muayeneKayitlari.find(m => String(m.randevuId) === String(randevu.id));
        const muayeneyeAitTahliller = muayene ? tahlilIstekleri.filter(t => String(t.muayeneId) === String(muayene.id)) : [];
        const muayeneyeAitSonuclar = muayene ? tahlilSonuclari.filter(s => String(s.muayeneId) === String(muayene.id)) : [];
        const recete = muayene ? receteler.find(rec => String(rec.muayeneId) === String(muayene.id)) : null;
        return { ...randevu, muayene, tahliller: muayeneyeAitTahliller, sonuclar: muayeneyeAitSonuclar, recete };
      })
      .sort((a, b) => new Date(`${b.tarih}T${b.saat}`) - new Date(`${a.tarih}T${a.saat}`));
  }, [girisYapanKullanici, aktifDoktorDemoKaydi, randevuListesi, muayeneKayitlari, tahlilIstekleri, tahlilSonuclari, receteler]);

  const bashekimDoktorPerformanslari = useMemo(() => {
    return DOKTOR_LISTESI.map(doktor => {
      const doktorRandevulari = randevuListesi.filter(r => Number(r.doktorId) === Number(doktor.id));
      const aktifSlotlar = randevuSlotlari.filter(s => Number(s.doktorId) === Number(doktor.id) && s.durum === "MUSAIT").length;
      return { doktorId: doktor.id, doktor: doktor.ad, unvan: doktor.unvan, poliklinik: doktor.poliklinik, hastaSayisi: doktorRandevulari.length, aktifSlotSayisi: aktifSlotlar, dolulukPuani: doktorRandevulari.length * 10 + (aktifSlotlar > 0 ? 20 : 0) };
    }).sort((a, b) => b.hastaSayisi - a.hastaSayisi);
  }, [randevuListesi, randevuSlotlari]);

  const poliklinikYogunlukOzeti = useMemo(() => {
    const POLIKLINIKLER = Object.keys(DOKTOR_HAVUZU);
    return POLIKLINIKLER.map(poliklinik => {
      const randevuSayisi = randevuListesi.filter(r => r.poliklinik === poliklinik).length;
      const musaitSlot = randevuSlotlari.filter(s => s.poliklinik === poliklinik && s.durum === "MUSAIT").length;
      return { poliklinik, randevuSayisi, musaitSlot, seviye: randevuSayisi >= 5 ? "Yoğun" : randevuSayisi >= 2 ? "Orta" : "Düşük" };
    }).filter(item => item.randevuSayisi > 0 || item.musaitSlot > 0).sort((a, b) => b.randevuSayisi - a.randevuSayisi);
  }, [randevuListesi, randevuSlotlari]);

  const bugunkuSistemOzeti = useMemo(() => {
    const bugunkuRandevular = randevuListesi.filter(r => r.tarih === bugunString);
    const acikSikayet = BASHEKIM_DEMO_SIKAYETLERI.filter(s => s.durum === "Açık").length;
    const aktifDoktorSayisi = new Set(randevuSlotlari.map(s => s.doktorId)).size;
    return { bugunkuRandevu: bugunkuRandevular.length, acikSikayet, aktifDoktorSayisi, toplamHekim: DOKTOR_LISTESI.length, toplamHastaRandevu: randevuListesi.length };
  }, [randevuListesi, randevuSlotlari, bugunString]);

  // ─── Render fonksiyonları ─────────────────────────────────────────────────────
  const renderBashekimDashboard = () => (
    <div className="table-container">
      <div className="mhrs-banner" style={{ marginBottom: '16px' }}>Hoş Geldiniz Başhekim {girisYapanKullanici?.adSoyad}</div>
      <div className="mhrs-action-grid" style={{ marginBottom: '20px' }}>
        <div className="mhrs-secondary-panel"><h3>Bugünkü Randevular</h3><p>{bugunkuSistemOzeti.bugunkuRandevu} adet</p></div>
        <div className="mhrs-secondary-panel"><h3>Açık Şikayet</h3><p>{bugunkuSistemOzeti.acikSikayet} adet</p></div>
        <div className="mhrs-secondary-panel"><h3>Aktif Doktor</h3><p>{bugunkuSistemOzeti.aktifDoktorSayisi} kişi</p></div>
        <div className="mhrs-secondary-panel"><h3>Toplam Randevu</h3><p>{bugunkuSistemOzeti.toplamHastaRandevu} kayıt</p></div>
      </div>
      <div className="mhrs-choice-grid" style={{ marginBottom: '20px' }}>
        <button className="mhrs-choice-card poliklinik" onClick={() => setAktifSekme("Başhekim Profili")}><span className="mhrs-choice-icon">👤</span><span>Başhekim Profili</span></button>
        <button className="mhrs-choice-card konum" onClick={() => setAktifSekme("Şikayet/Öneri Yönetimi")}><span className="mhrs-choice-icon">📝</span><span>Şikayet / Öneri</span></button>
        <button className="mhrs-choice-card poliklinik" onClick={() => setAktifSekme("Nöbet ve Çalışma Çizelgesi")}><span className="mhrs-choice-icon">🗓️</span><span>Nöbet Çizelgesi</span></button>
        <button className="mhrs-choice-card konum" onClick={() => setAktifSekme("Performans Analizi")}><span className="mhrs-choice-icon">📊</span><span>Performans Analizi</span></button>
      </div>
      <div className="table-header" style={{ marginBottom: '14px' }}>
        <h3>Hızlı Yönetim Özeti</h3>
        <p style={{ color: '#64748b', marginTop: '6px' }}>Doktor yoğunluğu, poliklinik doluluğu ve hasta geri bildirimlerini tek ekrandan takip edin.</p>
      </div>
      <table className="modern-table">
        <thead><tr><th>Doktor</th><th>Poliklinik</th><th>Hasta Sayısı</th><th>Aktif Slot</th></tr></thead>
        <tbody>
          {bashekimDoktorPerformanslari.slice(0, 6).map(item => (
            <tr key={item.doktorId}><td>{item.doktor}</td><td>{item.poliklinik}</td><td>{item.hastaSayisi}</td><td>{item.aktifSlotSayisi}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBashekimSikayetleri = () => (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h3>📝 Hasta Şikayet ve Önerileri</h3>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Başhekim panelinde hasta geri bildirimlerini görüntüleyebilir ve süreçleri takip edebilirsiniz.</p>
      </div>
      <table className="modern-table">
        <thead><tr><th>Hasta</th><th>Konu</th><th>Birim</th><th>Tarih</th><th>Durum</th><th>Mesaj</th></tr></thead>
        <tbody>
          {BASHEKIM_DEMO_SIKAYETLERI.map(item => (
            <tr key={item.id}>
              <td>{item.hasta}</td><td>{item.konu}</td><td>{item.birim}</td><td>{formatTarih(item.tarih)}</td>
              <td><span className={`status-badge ${item.durum === "Çözüldü" ? "status-active" : item.durum === "İnceleniyor" ? "status-pending" : "status-inactive"}`}>{item.durum}</span></td>
              <td>{item.mesaj}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBashekimNobetleri = () => (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h3>🗓️ Nöbet ve Çalışma Çizelgesi</h3>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Doktorların planlanmış nöbet ve çalışma saatlerini görüntüleyin.</p>
      </div>
      <table className="modern-table">
        <thead><tr><th>Doktor</th><th>Poliklinik</th><th>Tarih</th><th>Saat</th><th>Durum</th></tr></thead>
        <tbody>
          {BASHEKIM_DEMO_NOBETLERI.map(item => (
            <tr key={item.id}>
              <td>{item.doktor}</td><td>{item.poliklinik}</td><td>{formatTarih(item.tarih)}</td><td>{item.saat}</td>
              <td><span className={`status-badge ${item.durum === "Onaylı" ? "status-active" : "status-pending"}`}>{item.durum}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBashekimPerformansAnalizi = () => (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h3>📊 Doktor Performans Analizi</h3>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Doktor bazlı hasta sayısı, aktif slotlar ve poliklinik yoğunluğu burada görüntülenir.</p>
      </div>
      <div className="mhrs-action-grid" style={{ marginBottom: '20px' }}>
        <div className="mhrs-secondary-panel"><h3>En Yoğun Doktor</h3><p>{bashekimDoktorPerformanslari[0]?.doktor || "Veri yok"}</p></div>
        <div className="mhrs-secondary-panel"><h3>En Yoğun Poliklinik</h3><p>{poliklinikYogunlukOzeti[0]?.poliklinik || "Veri yok"}</p></div>
        <div className="mhrs-secondary-panel"><h3>Toplam Hekim</h3><p>{bugunkuSistemOzeti.toplamHekim}</p></div>
        <div className="mhrs-secondary-panel"><h3>Toplam Randevu</h3><p>{bugunkuSistemOzeti.toplamHastaRandevu}</p></div>
      </div>
      <h4 style={{ marginBottom: '12px' }}>Doktor Bazlı Görünüm</h4>
      <table className="modern-table" style={{ marginBottom: '24px' }}>
        <thead><tr><th>Doktor</th><th>Unvan</th><th>Poliklinik</th><th>Hasta Sayısı</th><th>Aktif Slot</th><th>Skor</th></tr></thead>
        <tbody>
          {bashekimDoktorPerformanslari.map(item => (
            <tr key={item.doktorId}><td>{item.doktor}</td><td>{item.unvan}</td><td>{item.poliklinik}</td><td>{item.hastaSayisi}</td><td>{item.aktifSlotSayisi}</td><td>{item.dolulukPuani}</td></tr>
          ))}
        </tbody>
      </table>
      <h4 style={{ marginBottom: '12px' }}>Poliklinik Yoğunluk Özeti</h4>
      <table className="modern-table">
        <thead><tr><th>Poliklinik</th><th>Randevu Sayısı</th><th>Müsait Slot</th><th>Yoğunluk</th></tr></thead>
        <tbody>
          {poliklinikYogunlukOzeti.map(item => (
            <tr key={item.poliklinik}>
              <td>{item.poliklinik}</td><td>{item.randevuSayisi}</td><td>{item.musaitSlot}</td>
              <td><span className={`status-badge ${item.seviye === "Yoğun" ? "status-inactive" : item.seviye === "Orta" ? "status-pending" : "status-active"}`}>{item.seviye}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDoktorMuayeneSurecleri = () => (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h3>🩺 Muayene ve Tahlil Süreç Yönetimi</h3>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Randevu alan hastaları adım adım yönetin.</p>
      </div>
      <div className="muayene-flow-list">
        {doktoraAitMuayeneSurecleri.length > 0 ? doktoraAitMuayeneSurecleri.map(item => {
          const muayene = item.muayene;
          const durum = muayene?.durum || item.durum;
          return (
            <div key={item.id} className="muayene-flow-card">
              <div className="muayene-flow-top">
                <div><h4>{item.doktor} • {item.poliklinik}</h4><p>Randevu ID: {item.id}</p></div>
                <span className={`status-badge ${durum === "TAMAMLANDI" || durum === "RECETE_YAZILDI" || durum === "DOKTOR_INCELEDI" ? "status-active" : "status-pending"}`}>{durum}</span>
              </div>
              <div className="muayene-flow-meta">
                <div><strong>Tarih:</strong> {formatTarih(item.tarih)}</div>
                <div><strong>Saat:</strong> {item.saat}</div>
                <div><strong>Şikayet:</strong> {item.sikayet}</div>
              </div>
              <div className="surec-adimlari">
                <span className={`surec-chip ${item.durum === "HASTA_GELDI" || item.durum === "MUAYENEDE" || muayene ? "active" : ""}`}>Hasta Geldi</span>
                <span className={`surec-chip ${muayene ? "active" : ""}`}>Muayene Başladı</span>
                <span className={`surec-chip ${item.tahliller.length > 0 ? "active" : ""}`}>Tahlil İstendi</span>
                <span className={`surec-chip ${item.tahliller.some(t => t.durum === "LABORATUVARDA" || t.durum === "SONUCLANDI" || t.durum === "DOKTOR_INCELEDI") ? "active" : ""}`}>Numune / Lab</span>
                <span className={`surec-chip ${item.sonuclar.length > 0 ? "active" : ""}`}>Sonuçlandı</span>
                <span className={`surec-chip ${item.recete ? "active" : ""}`}>Reçete</span>
                <span className={`surec-chip ${durum === "TAMAMLANDI" ? "active" : ""}`}>Tamamlandı</span>
              </div>
              {muayene && (
                <div className="muayene-detay-box">
                  <p><strong>Ön Tanı:</strong> {muayene.onTani}</p>
                  <p><strong>Doktor Notu:</strong> {muayene.doktorNotu}</p>
                  {item.tahliller.length > 0 && <p><strong>İstenen Tahliller:</strong> {item.tahliller.map(t => `${t.tahlilTuru} (${t.durum})`).join(", ")}</p>}
                  {item.sonuclar.length > 0 && <p><strong>Sonuç Özeti:</strong> {item.sonuclar.map(s => s.sonucOzeti).join(" | ")}</p>}
                  {item.recete && <p><strong>Reçete:</strong> {item.recete.ilaclar.map(i => `${i.ilacAdi} - ${i.kullanim}`).join(" / ")}</p>}
                </div>
              )}
              <div className="muayene-action-row">
                <button className="process-btn" onClick={() => hastaGeldiIsaretle(item.id)}>Hasta Geldi</button>
                <button className="process-btn" onClick={() => muayeneBaslat(item)}>Muayeneyi Başlat</button>
                <button className="process-btn" onClick={() => tahlilIste(item)}>Tahlil İste</button>
                {muayene && (
                  <>
                    <button className="process-btn secondary" onClick={() => numuneVerildiIsaretle(muayene.id)}>Numune Verildi</button>
                    <button className="process-btn secondary" onClick={() => tahlilSonucuHazirla(muayene.id)}>Sonucu Oluştur</button>
                    <button className="process-btn secondary" onClick={() => sonucuIncele(muayene.id)}>Sonucu İncele</button>
                    <button className="process-btn success" onClick={() => receteYaz(muayene.id, item.poliklinik)}>Reçete Yaz</button>
                    <button className="process-btn complete" onClick={() => muayeneTamamla(item.id, muayene.id)}>Muayeneyi Tamamla</button>
                  </>
                )}
              </div>
            </div>
          );
        }) : <div className="mhrs-empty-state">Doktora ait aktif muayene süreci bulunamadı.</div>}
      </div>
    </div>
  );

  const renderHastaRandevuAkisi = () => {
    const uygunHastaneler = hastaRandevuAkisi.aramaTuru === "poliklinik"
      ? poliklinigeGoreUygunHastaneler(hastaRandevuAkisi.poliklinik)
      : konumaGoreSiraliHastaneler(hastaRandevuAkisi.il);

    const uygunPoliklinikler = hastaRandevuAkisi.hastaneId
      ? hastaneyeGoreUygunPoliklinikler(hastaRandevuAkisi.hastaneId)
      : Object.keys(DOKTOR_HAVUZU);

    const uygunDoktorlar = hastaRandevuAkisi.hastaneId && hastaRandevuAkisi.poliklinik
      ? hastaneVePoliklinigeGoreDoktorlar(hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik)
      : [];

    if (randevuAdimi === "ana") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-action-grid">
            <button className="mhrs-main-action-card hospital" onClick={() => setRandevuAdimi("arama-turu")}>
              <div className="mhrs-main-action-icon">🏥</div>
              <div><h3>Hastaneden Randevu Al</h3><p>Poliklinik veya konuma göre uygun hastane ve hekim seçin.</p></div>
            </button>
            <div className="mhrs-secondary-panel">
              <h3>Yaklaşan Randevularım</h3>
              <p>{randevuListesi.length > 0 ? `${randevuListesi.length} adet randevu kaydınız görüntüleniyor.` : "Yaklaşan randevunuz bulunmamaktadır."}</p>
            </div>
          </div>
        </div>
      );
    }

    if (randevuAdimi === "arama-turu") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Hastaneden Randevu Al</h3></div>
          <div className="mhrs-choice-grid">
            <button className="mhrs-choice-card poliklinik" onClick={() => handleAramaTuruSec("poliklinik")}><span className="mhrs-choice-icon">📋</span><span>Polikliniğe Göre</span></button>
            <button className="mhrs-choice-card konum" onClick={() => handleAramaTuruSec("konum")}><span className="mhrs-choice-icon">📍</span><span>Konuma Göre</span></button>
          </div>
        </div>
      );
    }

    if (randevuAdimi === "konum-sec") {
      const konumdakiHastaneler = bulunanKonum.il ? konumaGoreSiraliHastaneler(bulunanKonum.il) : [];
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Konum Seçiniz</h3></div>
          <div className="mhrs-list-panel">
            <div className="mhrs-inline-actions">
              <button className="login-submit-btn" onClick={konumuTespitEt} disabled={konumYukleniyor}>
                {konumYukleniyor ? "Konum Alınıyor..." : "📍 Mevcut Konumumu Kullan"}
              </button>
            </div>
            {bulunanKonum.il && (
              <div className="status-indicator" style={{ marginBottom: '14px' }}>
                Mevcut konum: <b>{bulunanKonum.il} / {bulunanKonum.ilce}</b><br /><small>{bulunanKonum.detay}</small>
              </div>
            )}
            {bulunanKonum.il && (
              <>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>Konumunuza uygun hastaneler aşağıda listelendi:</div>
                {konumdakiHastaneler.length > 0 ? konumdakiHastaneler.map(hastane => (
                  <button key={hastane.id} className="mhrs-hospital-card" onClick={() => handleHastaHastaneSec(hastane.id)}>
                    <div className="mhrs-hospital-header">
                      <div><h4>{hastane.ad}</h4><p>{hastane.il} / {hastane.ilce}</p></div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {hastane.enYakinMi && <span className="mhrs-small-badge" style={{ background: '#dcfce7', color: '#166534' }}>⭐ Size En Yakın Hastane</span>}
                        {typeof hastane.mesafeKm === "number" && <span className="mhrs-small-badge">{hastane.mesafeKm} km</span>}
                      </div>
                    </div>
                  </button>
                )) : <div className="mhrs-empty-state">Bu konumda uygun hastane bulunamadı.</div>}
                <div style={{ marginTop: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>Farklı bir il seçmek isterseniz:</label>
                  <select className="login-input" value={seciliIl} onChange={(e) => handleHastaIlSec(e.target.value)}>
                    <option value="">İl seçiniz</option>
                    {HASTANELER.map(h => h.il).filter((v, i, arr) => arr.indexOf(v) === i).map(il => <option key={il} value={il}>{il}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "poliklinik-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Poliklinik Seçiniz</h3></div>
          <div className="mhrs-list-panel">
            {uygunPoliklinikler.map(pol => (
              <button key={pol} className="mhrs-list-card" onClick={() => handleHastaPoliklinikSec(pol)}>
                <div><h4>{pol}</h4><p>Bu alanda uygun hekimleri görüntüleyin.</p></div><span>›</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "hastane-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Hastane Seçiniz</h3></div>
          <div className="mhrs-list-panel">
            {uygunHastaneler.length > 0 ? uygunHastaneler.map(hastane => (
              <button key={hastane.id} className="mhrs-hospital-card" onClick={() => handleHastaHastaneSec(hastane.id)}>
                <div className="mhrs-hospital-header">
                  <div><h4>{hastane.ad}</h4><p>{hastane.il}{hastane.ilce ? ` / ${hastane.ilce}` : ""}</p></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {hastane.enYakinMi && hastaRandevuAkisi.aramaTuru === "konum" && <span className="mhrs-small-badge" style={{ background: '#dcfce7', color: '#166534' }}>⭐ Size En Yakın Hastane</span>}
                    {typeof hastane.mesafeKm === "number" && <span className="mhrs-small-badge">{hastane.mesafeKm} km</span>}
                  </div>
                </div>
                {hastaRandevuAkisi.aramaTuru === "poliklinik" && <div className="mhrs-hospital-meta"><span>Poliklinik: {hastaRandevuAkisi.poliklinik}</span></div>}
              </button>
            )) : <div className="mhrs-empty-state">Seçtiğiniz kriterlere uygun hastane bulunamadı.</div>}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "doktor-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Doktor Seçiniz</h3></div>
          <div className="mhrs-list-panel">
            {uygunDoktorlar.length > 0 ? uygunDoktorlar.map(doc => (
              <button key={doc.id} className="mhrs-doctor-card" onClick={() => handleHastaDoktorSec(doc.id)}>
                <div className="mhrs-doctor-left">
                  <div className="doc-avatar">👨‍⚕️</div>
                  <div><h4>{doc.ad}</h4><p>{doc.unvan}</p><small>{seciliHastane?.ad}</small></div>
                </div>
                <div className="mhrs-doctor-right">
                  <span className="mhrs-small-badge">Uygun {doc.uygunSlotSayisi}</span>
                  {doc.ilkMusaitSlot && <small>En yakın: {formatTarih(doc.ilkMusaitSlot.tarih)}</small>}
                </div>
              </button>
            )) : <div className="mhrs-empty-state">Bu hastane ve poliklinikte müsait doktor bulunamadı.</div>}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "slot-sec") {
      const tarihler = doktoraVeHastaneyeGoreMusaitTarihler(hastaRandevuAkisi.doktorId, hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik);
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Randevu Saati Seçiniz</h3></div>
          <div className="mhrs-list-panel">
            {tarihler.map(tarih => {
              const saatler = doktoraVeHastaneyeGoreSaatler(hastaRandevuAkisi.doktorId, hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik, tarih);
              return (
                <div key={tarih} className="mhrs-slot-group">
                  <div className="mhrs-slot-date">{formatTarih(tarih)}</div>
                  <div className="mhrs-slot-subtitle">{hastaRandevuAkisi.poliklinik} • {seciliDoktor?.ad}</div>
                  <div className="mhrs-slot-grid">
                    {saatler.map(slot => <button key={slot.id} className="mhrs-slot-btn" onClick={() => handleHastaSlotSec(slot.id)}>{slot.saat}</button>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "onay" && randevuOzeti) {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top"><button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button><h3>Randevuyu Onayla</h3></div>
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
          <button className="mhrs-confirm-btn" onClick={handleRandevuAl}>Randevuyu Onayla</button>
        </div>
      );
    }

    return null;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (!girisYapanKullanici) {
    return (
      <Login
        handleGiris={handleGiris} tcNo={tcNo} setTcNo={setTcNo} sifre={sifre} setSifre={setSifre}
        hataMesaji={hataMesaji} kayitModu={kayitModu} setKayitModu={setKayitModu}
        geriDon={() => setKayitModu(false)} yeniHastaEkle={yeniHastaEkle}
        beklemeSuresi={beklemeSuresi} isBanned={isBanned}
      />
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        rol={girisYapanKullanici.rol} aktifSekme={aktifSekme} setAktifSekme={setAktifSekme}
        logout={() => { localStorage.removeItem("token"); setGirisYapanKullanici(null); resetHastaRandevuAkisi(); }}
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
              {girisYapanKullanici.rol === "HASTA" ? (
                <><div className="mhrs-banner">Hoş Geldiniz, {girisYapanKullanici.adSoyad}</div>{renderHastaRandevuAkisi()}</>
              ) : girisYapanKullanici.rol === "BASHEKIM" ? renderBashekimDashboard() : (
                <div className="table-container">
                  <h3 style={{ marginBottom: '8px' }}>Sistem Özeti</h3>
                  <p style={{ color: '#64748b' }}>Bu panel üzerinden profil, randevu ve çalışma takvimi işlemlerinizi yönetebilirsiniz.</p>
                </div>
              )}
            </>
          )}

          {aktifSekme === "Kişisel Bilgiler" && girisYapanKullanici.rol === "HASTA" && <PatientProfileInfo hasta={girisYapanKullanici} />}
          {aktifSekme === "Doktor Bilgileri" && girisYapanKullanici.rol === "DOKTOR" && <DoctorProfileInfo doktor={girisYapanKullanici} baslik="SAĞLIK PERSONELİ" />}
          {(aktifSekme === "Başhekim Profili" || (aktifSekme === "Doktor Bilgileri" && girisYapanKullanici.rol === "BASHEKIM")) && <DoctorProfileInfo doktor={girisYapanKullanici} baslik="BAŞHEKİM" />}

          {aktifSekme === "Randevularım" && <TableRandevular veriler={goruntulenecekRandevular} />}
          {aktifSekme === "Tahlillerim" && <TableTahliller veriler={hastayaAitTahlilGorunumu} />}
          {aktifSekme === "Otopark Durumu" && <ParkingLot />}
          {aktifSekme === "Yatışlar" && <TableYatislar />}
          {aktifSekme === "Personel" && <TablePersonel />}
          {aktifSekme === "Muayene Süreçleri" && girisYapanKullanici.rol === "DOKTOR" && renderDoktorMuayeneSurecleri()}
          {aktifSekme === "Şikayet/Öneri" && girisYapanKullanici.rol !== "BASHEKIM" && <TableSikayet />}
          {(aktifSekme === "Şikayet/Öneri Yönetimi" || (aktifSekme === "Şikayet/Öneri" && girisYapanKullanici.rol === "BASHEKIM")) && renderBashekimSikayetleri()}
          {aktifSekme === "Nöbet ve Çalışma Çizelgesi" && girisYapanKullanici.rol === "BASHEKIM" && renderBashekimNobetleri()}
          {aktifSekme === "Performans Analizi" && girisYapanKullanici.rol === "BASHEKIM" && renderBashekimPerformansAnalizi()}

          {aktifSekme === "Çalışma Takvimi" && girisYapanKullanici.rol === "DOKTOR" && (
            <div className="table-container">
              <div className="table-header" style={{ marginBottom: '20px' }}>
                <h3>🗓️ Çalışma Takvimi Yönetimi</h3>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Hastane, gün ve saat seçerek kendi uygunluk planınızı oluşturun.</p>
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
                            <select className="schedule-date-input" value={doktorTakvimFormu.hastaneId}
                              onChange={(e) => setDoktorTakvimFormu(prev => ({ ...prev, hastaneId: e.target.value, seciliSaatler: [] }))}>
                              <option value="">Hastane seçiniz</option>
                              {HASTANELER.map(h => <option key={h.id} value={h.id}>{h.ad}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="schedule-label">Gün Seçiniz</label>
                        <div className="schedule-date-card">
                          <div className="schedule-date-input-wrap">
                            <span className="schedule-date-icon">📅</span>
                            <input type="date" className="schedule-date-input" value={doktorTakvimFormu.tarih}
                              onChange={(e) => setDoktorTakvimFormu(prev => ({ ...prev, tarih: e.target.value, seciliSaatler: [] }))} />
                          </div>
                          <div className="schedule-date-preview">
                            {doktorTakvimFormu.tarih ? `Seçilen gün: ${formatTarih(doktorTakvimFormu.tarih)}` : "Henüz bir gün seçilmedi"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <label className="schedule-label">Saat Seçiniz</label>
                      <div className="schedule-time-grid">
                        {SAAT_SECENEKLERI.map(saat => (
                          <button type="button" key={saat}
                            className={`schedule-time-chip ${doktorTakvimFormu.seciliSaatler.includes(saat) ? 'active' : ''}`}
                            onClick={() => doktorSaatSeciminiDegistir(saat)}>
                            {saat}
                          </button>
                        ))}
                      </div>
                      <div className="schedule-selected-info">
                        {doktorTakvimFormu.seciliSaatler.length > 0 ? `Seçilen saatler: ${doktorTakvimFormu.seciliSaatler.join(", ")}` : "Henüz saat seçilmedi"}
                      </div>
                    </div>
                    <button className="login-submit-btn" style={{ marginTop: '16px' }} onClick={doktorTakvimeSlotEkle}>Seçili Slotları Ekle</button>
                  </div>
                  <table className="modern-table">
                    <thead><tr><th>Hastane</th><th>Tarih</th><th>Saat</th><th>Durum</th><th>İşlem</th></tr></thead>
                    <tbody>
                      {randevuSlotlari.filter(slot => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id)).sort(slotSirala).map(slot => {
                        const hastane = HASTANELER.find(h => Number(h.id) === Number(slot.hastaneId));
                        return (
                          <tr key={slot.id}>
                            <td>{hastane?.ad || "Hastane Yok"}</td>
                            <td>{formatTarih(slot.tarih)}</td>
                            <td>{slot.saat}</td>
                            <td><span className={`status-badge ${slot.durum === "MUSAIT" ? "status-active" : "status-pending"}`}>{slot.durum}</span></td>
                            <td><button onClick={() => doktorSlotSil(slot.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>Sil</button></td>
                          </tr>
                        );
                      })}
                      {randevuSlotlari.filter(slot => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id)).length === 0 && (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Henüz tanımlanmış çalışma slotunuz bulunmuyor.</td></tr>
                      )}
                    </tbody>
                  </table>
                </>
              ) : <div className="mhrs-empty-state">Doktor kaydınız demo hekim listesiyle eşleşmediği için takvim ekranı açılamadı.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}