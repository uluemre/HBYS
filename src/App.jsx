import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css'
import { Login } from './components/login'
import { Sidebar } from './components/sidebar'
import {
  TableRandevular, TableTahliller, TableOtopark,
  TableYatislar, TableSikayet, TablePersonel
} from './components/tables'
import ParkingLot from "./components/ParkingLot";

const HASTANELER = [
  { id: 1, ad: "İstanbul Şehir Hastanesi", il: "İstanbul" },
  { id: 2, ad: "Ankara Merkez Hastanesi", il: "Ankara" },
  { id: 3, ad: "İzmir Eğitim ve Araştırma Hastanesi", il: "İzmir" },
  { id: 4, ad: "Bursa Devlet Hastanesi", il: "Bursa" },
  { id: 5, ad: "Antalya Bölge Hastanesi", il: "Antalya" },
  { id: 6, ad: "Adana Şehir Hastanesi", il: "Adana" },
  { id: 7, ad: "Konya Eğitim Hastanesi", il: "Konya" },
  { id: 8, ad: "Gaziantep Merkez Hastanesi", il: "Gaziantep" },
  { id: 9, ad: "Kocaeli Şehir Hastanesi", il: "Kocaeli" },
  { id: 10, ad: "Samsun Devlet Hastanesi", il: "Samsun" }
];

const POLIKLINIKLER = [
  "Acil Servis",
  "Dahiliye (İç Hastalıkları)",
  "Göz Hastalıkları",
  "Kulak Burun Boğaz",
  "Kardiyoloji",
  "Ortopedi",
  "Kadın Doğum",
  "Pediatri",
  "Nöroloji",
  "Genel Cerrahi",
  "Üroloji",
  "Göğüs Hastalıkları",
  "Dermatoloji",
  "Psikiyatri",
  "Fizik Tedavi",
  "Enfeksiyon",
  "Endokrinoloji",
  "Gastroenteroloji",
  "Nefroloji",
  "Onkoloji"
];

const SAAT_SECENEKLERI = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
];

const DOKTOR_HAVUZU = {
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
  "Dermatoloji": [{ id: 25, ad: "Dr. Deniz Cilt", unvan: "Uzm. Dr." }, { id: 26, ad: "Dr. Ece Deri", unvan: "Uzm. Dr." }],
  "Psikiyatri": [{ id: 27, ad: "Dr. Özgür Ruh", unvan: "Prof. Dr." }, { id: 28, ad: "Dr. Melis Terapi", unvan: "Uzm. Dr." }],
  "Fizik Tedavi": [{ id: 29, ad: "Dr. Burak Fizik", unvan: "Doç. Dr." }, { id: 30, ad: "Dr. Hale Hareket", unvan: "Uzm. Dr." }],
  "Enfeksiyon": [{ id: 31, ad: "Dr. Yavuz Mikrop", unvan: "Uzm. Dr." }, { id: 32, ad: "Dr. Selin Virüs", unvan: "Uzm. Dr." }],
  "Endokrinoloji": [{ id: 33, ad: "Dr. Levent Hormon", unvan: "Prof. Dr." }, { id: 34, ad: "Dr. Esra Şeker", unvan: "Uzm. Dr." }],
  "Gastroenteroloji": [{ id: 35, ad: "Dr. Cem Mide", unvan: "Doç. Dr." }, { id: 36, ad: "Dr. Sevil Sindirim", unvan: "Uzm. Dr." }],
  "Nefroloji": [{ id: 37, ad: "Dr. Hasan Böbrek", unvan: "Prof. Dr." }, { id: 38, ad: "Dr. Derya Nefro", unvan: "Uzm. Dr." }],
  "Onkoloji": [{ id: 39, ad: "Dr. Berk Tümör", unvan: "Prof. Dr." }, { id: 40, ad: "Dr. Işıl Terapi", unvan: "Doç. Dr." }]
};

const DOKTOR_LISTESI = Object.entries(DOKTOR_HAVUZU).flatMap(([poliklinik, liste]) =>
  liste.map(doktor => ({ ...doktor, poliklinik }))
);

const normalizeText = (text = "") =>
  text
    .toLocaleLowerCase('tr-TR')
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();

const formatTarih = (tarihStr) => {
  try {
    return new Date(tarihStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return tarihStr;
  }
};

const futureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const createInitialSlots = () => {
  const slots = [];
  let id = 1000;

  HASTANELER.forEach((hastane, hIndex) => {
    DOKTOR_LISTESI.forEach((doktor, dIndex) => {
      const gun1 = futureDate(((hIndex + dIndex) % 5) + 1);
      const gun2 = futureDate(((hIndex + dIndex + 2) % 7) + 3);

      const saat1 = SAAT_SECENEKLERI[(doktor.id + hastane.id) % SAAT_SECENEKLERI.length];
      const saat2 = SAAT_SECENEKLERI[(doktor.id + hastane.id + 3) % SAAT_SECENEKLERI.length];

      slots.push({
        id: id++,
        hastaneId: hastane.id,
        doktorId: doktor.id,
        poliklinik: doktor.poliklinik,
        tarih: gun1,
        saat: saat1,
        durum: "MUSAIT"
      });

      slots.push({
        id: id++,
        hastaneId: hastane.id,
        doktorId: doktor.id,
        poliklinik: doktor.poliklinik,
        tarih: gun2,
        saat: saat2,
        durum: ((doktor.id + hastane.id) % 7 === 0) ? "DOLU" : "MUSAIT"
      });
    });
  });

  return slots;
};

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
  const bugunString = new Date().toISOString().split('T')[0];

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

  const [randevuAdimi, setRandevuAdimi] = useState("ana");
  const [hastaRandevuAkisi, setHastaRandevuAkisi] = useState({
    aramaTuru: "",
    il: "",
    poliklinik: "",
    hastaneId: "",
    doktorId: "",
    slotId: ""
  });

  const [doktorTakvimFormu, setDoktorTakvimFormu] = useState({
    hastaneId: "",
    tarih: "",
    seciliSaatler: []
  });

  const [randevuListesi, setRandevuListesi] = useState(() => {
    const kaydedilmis = localStorage.getItem("hastane_randevular");
    return kaydedilmis ? JSON.parse(kaydedilmis) : [
      {
        id: "#1284",
        poliklinik: "Göz Hastalıkları",
        doktor: "Dr. Ali Bakış",
        doktorId: 5,
        hastane: "İstanbul Şehir Hastanesi",
        tarih: futureDate(1),
        saat: "10:30",
        durum: "ONAYLANDI",
        sikayet: "Sistem üzerinden randevu alındı."
      }
    ];
  });

  const [randevuSlotlari, setRandevuSlotlari] = useState(() => {
    const kaydedilmisSlotlar = localStorage.getItem("hastane_randevu_slotlari");
    return kaydedilmisSlotlar ? JSON.parse(kaydedilmisSlotlar) : createInitialSlots();
  });

  useEffect(() => {
    localStorage.setItem("hastane_randevular", JSON.stringify(randevuListesi));
  }, [randevuListesi]);

  useEffect(() => {
    localStorage.setItem("hastane_randevu_slotlari", JSON.stringify(randevuSlotlari));
  }, [randevuSlotlari]);

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

  const slotSirala = (a, b) => {
    const aDate = new Date(`${a.tarih}T${a.saat}`);
    const bDate = new Date(`${b.tarih}T${b.saat}`);
    return aDate - bDate;
  };

  const aktifDoktorDemoKaydi = (() => {
    if (!girisYapanKullanici || girisYapanKullanici.rol !== "DOKTOR") return null;

    const isimdenBul = DOKTOR_LISTESI.find(d =>
      normalizeText(d.ad) === normalizeText(girisYapanKullanici.adSoyad)
    );

    if (isimdenBul) return isimdenBul;

    const polikliniktenBul = DOKTOR_LISTESI.find(d =>
      normalizeText(d.poliklinik) === normalizeText(girisYapanKullanici.poliklinikIsmi || girisYapanKullanici.brans || "")
    );

    return polikliniktenBul || null;
  })();

  const seciliHastane = HASTANELER.find(h => String(h.id) === String(hastaRandevuAkisi.hastaneId));
  const seciliDoktor = DOKTOR_LISTESI.find(d => String(d.id) === String(hastaRandevuAkisi.doktorId));
  const seciliSlot = randevuSlotlari.find(s => String(s.id) === String(hastaRandevuAkisi.slotId));

  const randevuOzeti = seciliHastane && seciliDoktor && seciliSlot ? {
    hastane: seciliHastane,
    doktor: seciliDoktor,
    slot: seciliSlot,
    poliklinik: hastaRandevuAkisi.poliklinik
  } : null;

  const doktoraAitMusaitSlotlar = (doktorId, hastaneId = null, poliklinik = null) => {
    return randevuSlotlari
      .filter(slot =>
        Number(slot.doktorId) === Number(doktorId) &&
        slot.durum === "MUSAIT" &&
        slot.tarih >= bugunString &&
        (!hastaneId || Number(slot.hastaneId) === Number(hastaneId)) &&
        (!poliklinik || slot.poliklinik === poliklinik)
      )
      .sort(slotSirala);
  };

  const doktoraAitIlkMusaitSlot = (doktorId, hastaneId = null, poliklinik = null) => {
    const slotlar = doktoraAitMusaitSlotlar(doktorId, hastaneId, poliklinik);
    return slotlar.length > 0 ? slotlar[0] : null;
  };

  const hastaneyeGoreUygunPoliklinikler = (hastaneId) => {
    return [...new Set(
      randevuSlotlari
        .filter(slot =>
          Number(slot.hastaneId) === Number(hastaneId) &&
          slot.durum === "MUSAIT" &&
          slot.tarih >= bugunString
        )
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
        Number(slot.hastaneId) === Number(hastane.id) &&
        slot.durum === "MUSAIT" &&
        slot.tarih >= bugunString
      )
    );
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
      )
      .sort(slotSirala);
  };

  const resetHastaRandevuAkisi = () => {
    setHastaRandevuAkisi({
      aramaTuru: "",
      il: "",
      poliklinik: "",
      hastaneId: "",
      doktorId: "",
      slotId: ""
    });
    setRandevuAdimi("ana");
    setSeciliIl("");
    setSeciliPoliklinik("");
    setAramaSonuclari([]);
  };

  const geriGitRandevuAkisi = () => {
    if (randevuAdimi === "arama-turu") return setRandevuAdimi("ana");
    if (randevuAdimi === "konum-sec") return setRandevuAdimi("arama-turu");
    if (randevuAdimi === "hastane-sec") {
      return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "konum-sec" : "poliklinik-sec");
    }
    if (randevuAdimi === "poliklinik-sec") {
      return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "hastane-sec" : "arama-turu");
    }
    if (randevuAdimi === "doktor-sec") return setRandevuAdimi("poliklinik-sec");
    if (randevuAdimi === "slot-sec") return setRandevuAdimi("doktor-sec");
    if (randevuAdimi === "onay") return setRandevuAdimi("slot-sec");
  };

  const handleAramaTuruSec = (tur) => {
    setHastaRandevuAkisi({
      aramaTuru: tur,
      il: tur === "konum" ? (bulunanKonum.il || seciliIl || "") : "",
      poliklinik: "",
      hastaneId: "",
      doktorId: "",
      slotId: ""
    });
    setRandevuAdimi(tur === "konum" ? "konum-sec" : "poliklinik-sec");
  };

  const handleHastaIlSec = (il) => {
    setSeciliIl(il);
    setHastaRandevuAkisi(prev => ({
      ...prev,
      il,
      hastaneId: "",
      poliklinik: "",
      doktorId: "",
      slotId: ""
    }));
    setRandevuAdimi("hastane-sec");
  };

  const handleHastaPoliklinikSec = (poliklinik) => {
    setSeciliPoliklinik(poliklinik);
    setHastaRandevuAkisi(prev => ({
      ...prev,
      poliklinik,
      doktorId: "",
      slotId: ""
    }));

    if (hastaRandevuAkisi.aramaTuru === "poliklinik") {
      setRandevuAdimi("hastane-sec");
    } else {
      setRandevuAdimi("doktor-sec");
    }
  };

  const handleHastaHastaneSec = (hastaneId) => {
    setHastaRandevuAkisi(prev => ({
      ...prev,
      hastaneId,
      doktorId: "",
      slotId: "",
      ...(prev.aramaTuru === "konum" ? { poliklinik: "" } : {})
    }));

    if (hastaRandevuAkisi.aramaTuru === "konum") {
      setRandevuAdimi("poliklinik-sec");
    } else {
      setRandevuAdimi("doktor-sec");
    }
  };

  const handleHastaDoktorSec = (doktorId) => {
    setHastaRandevuAkisi(prev => ({
      ...prev,
      doktorId,
      slotId: ""
    }));
    setRandevuAdimi("slot-sec");
  };

  const handleHastaSlotSec = (slotId) => {
    setHastaRandevuAkisi(prev => ({
      ...prev,
      slotId
    }));
    setRandevuAdimi("onay");
  };

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
      rol: "HASTA"
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kayitPaketi)
      });
      const responseText = await response.text();

      if (response.ok) {
        alert("✅ Kayıt Başarılı!");
        setKayitModu(false);
        setTcNo(yeniHastaVerisi.tcNo);
      } else {
        let hata = "Kayıt hatası.";
        try { hata = JSON.parse(responseText).message || hata; } catch (_) { }
        setHataMesaji(`❌ ${hata}`);
      }
    } catch (error) {
      setHataMesaji("❌ Bağlantı hatası.");
    }
  };

  const handleRandevuAl = async () => {
    if (!randevuOzeti) return alert("Randevu özeti oluşturulamadı.");

    const token = localStorage.getItem("token");

    const ayniSlotDoluMu = randevuSlotlari.find(
      slot => Number(slot.id) === Number(randevuOzeti.slot.id) && slot.durum !== "MUSAIT"
    );
    if (ayniSlotDoluMu) {
      return alert("Bu slot artık uygun değil. Lütfen tekrar seçim yapınız.");
    }

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(randevuPaketi)
      });

      if (response.ok) {
        const yeniRandevu = {
          id: `#${Math.floor(Math.random() * 9000) + 1000}`,
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
          prev.map(slot =>
            Number(slot.id) === Number(randevuOzeti.slot.id)
              ? { ...slot, durum: "DOLU" }
              : slot
          )
        );

        alert("✅ Randevunuz başarıyla oluşturuldu!");
        resetHastaRandevuAkisi();
        setAktifSekme("Randevularım");
      } else {
        const err = await response.json();
        alert(`DB Reddi: ${err.message || "Eksik Veri"}`);
      }
    } catch (err) {
      alert("Sunucu bağlantı hatası!");
    }
  };

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

        const endpoint = result.data.rol === "DOKTOR" ? "/doktorlar/me" :
          (result.data.rol === "PERSONEL" ? "/personel/me" : "/hastalar/me");

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
    } catch (error) {
      setHataMesaji("Bağlantı hatası.");
    }
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

          setBulunanKonum({
            il: city,
            ilce: data.address.district || "Merkez",
            detay: `${data.address.suburb || ""} ${data.address.road || ""}`.trim()
          });

          setSeciliIl(city);

          setHastaRandevuAkisi(prev => ({
            ...prev,
            il: city,
            hastaneId: "",
            poliklinik: "",
            doktorId: "",
            slotId: ""
          }));

          setRandevuAdimi("hastane-sec");
          setKonumYukleniyor(false);
        } catch {
          setKonumYukleniyor(false);
        }
      }, () => {
        setKonumYukleniyor(false);
      });
    }
  };

  const doktorSaatSeciminiDegistir = (saat) => {
    setDoktorTakvimFormu(prev => {
      const seciliMi = prev.seciliSaatler.includes(saat);

      return {
        ...prev,
        seciliSaatler: seciliMi
          ? prev.seciliSaatler.filter(item => item !== saat)
          : [...prev.seciliSaatler, saat].sort((a, b) => {
            const aDate = new Date(`2000-01-01T${a}`);
            const bDate = new Date(`2000-01-01T${b}`);
            return aDate - bDate;
          })
      };
    });
  };

  const doktorTakvimeSlotEkle = () => {
    if (!aktifDoktorDemoKaydi) {
      return alert("Doktor kaydınız demo listesi ile eşleşmedi. Branşınıza ait hekim kaydı bulunamadı.");
    }

    if (
      !doktorTakvimFormu.hastaneId ||
      !doktorTakvimFormu.tarih ||
      doktorTakvimFormu.seciliSaatler.length === 0
    ) {
      return alert("Lütfen hastane, tarih ve en az bir saat seçiniz.");
    }

    const mevcutSaatler = randevuSlotlari
      .filter(slot =>
        Number(slot.hastaneId) === Number(doktorTakvimFormu.hastaneId) &&
        Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id) &&
        slot.tarih === doktorTakvimFormu.tarih
      )
      .map(slot => slot.saat);

    const yeniSaatler = doktorTakvimFormu.seciliSaatler.filter(
      saat => !mevcutSaatler.includes(saat)
    );

    if (yeniSaatler.length === 0) {
      return alert("Seçtiğiniz saatlerin tamamı zaten eklenmiş.");
    }

    const yeniSlotlar = yeniSaatler.map((saat, index) => ({
      id: Date.now() + index,
      hastaneId: Number(doktorTakvimFormu.hastaneId),
      doktorId: Number(aktifDoktorDemoKaydi.id),
      poliklinik: aktifDoktorDemoKaydi.poliklinik,
      tarih: doktorTakvimFormu.tarih,
      saat,
      durum: "MUSAIT"
    }));

    setRandevuSlotlari(prev => [...prev, ...yeniSlotlar].sort(slotSirala));

    const eklenemeyenSaatler = doktorTakvimFormu.seciliSaatler.filter(
      saat => mevcutSaatler.includes(saat)
    );

    setDoktorTakvimFormu(prev => ({
      ...prev,
      seciliSaatler: []
    }));

    if (eklenemeyenSaatler.length > 0) {
      alert(`✅ ${yeniSaatler.length} slot eklendi.\n⚠️ Zaten kayıtlı olan saatler: ${eklenemeyenSaatler.join(", ")}`);
    } else {
      alert(`✅ ${yeniSaatler.length} slot başarıyla eklendi.`);
    }
  };

  const doktorSlotSil = (slotId) => {
    setRandevuSlotlari(prev =>
      prev.filter(slot => Number(slot.id) !== Number(slotId))
    );
  };

  const goruntulenecekRandevular = girisYapanKullanici?.rol === "DOKTOR" && aktifDoktorDemoKaydi
    ? randevuListesi.filter(r => Number(r.doktorId) === Number(aktifDoktorDemoKaydi.id))
    : randevuListesi;

  const renderHastaRandevuAkisi = () => {
    const uygunHastaneler =
      hastaRandevuAkisi.aramaTuru === "poliklinik"
        ? poliklinigeGoreUygunHastaneler(hastaRandevuAkisi.poliklinik)
        : konumaGoreUygunHastaneler(hastaRandevuAkisi.il);

    const uygunPoliklinikler =
      hastaRandevuAkisi.hastaneId
        ? hastaneyeGoreUygunPoliklinikler(hastaRandevuAkisi.hastaneId)
        : POLIKLINIKLER;

    const uygunDoktorlar =
      hastaRandevuAkisi.hastaneId && hastaRandevuAkisi.poliklinik
        ? hastaneVePoliklinigeGoreDoktorlar(hastaRandevuAkisi.hastaneId, hastaRandevuAkisi.poliklinik)
        : [];

    if (randevuAdimi === "ana") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-action-grid">
            <button className="mhrs-main-action-card hospital" onClick={() => setRandevuAdimi("arama-turu")}>
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

    if (randevuAdimi === "arama-turu") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Hastaneden Randevu Al</h3>
          </div>

          <div className="mhrs-choice-grid">
            <button className="mhrs-choice-card poliklinik" onClick={() => handleAramaTuruSec("poliklinik")}>
              <span className="mhrs-choice-icon">📋</span>
              <span>Polikliniğe Göre</span>
            </button>

            <button className="mhrs-choice-card konum" onClick={() => handleAramaTuruSec("konum")}>
              <span className="mhrs-choice-icon">📍</span>
              <span>Konuma Göre</span>
            </button>
          </div>
        </div>
      );
    }

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

                {konumdakiHastaneler.length > 0 ? (
                  konumdakiHastaneler.map(hastane => (
                    <button
                      key={hastane.id}
                      className="mhrs-hospital-card"
                      onClick={() => handleHastaHastaneSec(hastane.id)}
                    >
                      <div className="mhrs-hospital-header">
                        <div>
                          <h4>{hastane.ad}</h4>
                          <p>{hastane.il}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="mhrs-empty-state">
                    Bu konumda uygun hastane bulunamadı.
                  </div>
                )}

                <div style={{ marginTop: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                    Farklı bir il seçmek isterseniz:
                  </label>
                  <select className="login-input" value={seciliIl} onChange={(e) => handleHastaIlSec(e.target.value)}>
                    <option value="">İl seçiniz</option>
                    {HASTANELER.map(h => h.il).filter((v, i, arr) => arr.indexOf(v) === i).map(il => (
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

    if (randevuAdimi === "poliklinik-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Poliklinik Seçiniz</h3>
          </div>

          <div className="mhrs-list-panel">
            {uygunPoliklinikler.map(pol => (
              <button
                key={pol}
                className="mhrs-list-card"
                onClick={() => handleHastaPoliklinikSec(pol)}
              >
                <div>
                  <h4>{pol}</h4>
                  <p>Bu alanda uygun hekimleri görüntüleyin.</p>
                </div>
                <span>›</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "hastane-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Hastane Seçiniz</h3>
          </div>

          <div className="mhrs-list-panel">
            {uygunHastaneler.length > 0 ? uygunHastaneler.map(hastane => (
              <button
                key={hastane.id}
                className="mhrs-hospital-card"
                onClick={() => handleHastaHastaneSec(hastane.id)}
              >
                <div className="mhrs-hospital-header">
                  <div>
                    <h4>{hastane.ad}</h4>
                    <p>{hastane.il}</p>
                  </div>
                </div>

                {hastaRandevuAkisi.aramaTuru === "poliklinik" && (
                  <div className="mhrs-hospital-meta">
                    <span>Poliklinik: {hastaRandevuAkisi.poliklinik}</span>
                  </div>
                )}
              </button>
            )) : (
              <div className="mhrs-empty-state">
                Seçtiğiniz kriterlere uygun hastane bulunamadı.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "doktor-sec") {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Doktor Seçiniz</h3>
          </div>

          <div className="mhrs-list-panel">
            {uygunDoktorlar.length > 0 ? uygunDoktorlar.map(doc => (
              <button
                key={doc.id}
                className="mhrs-doctor-card"
                onClick={() => handleHastaDoktorSec(doc.id)}
              >
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
            )) : (
              <div className="mhrs-empty-state">
                Bu hastane ve poliklinikte müsait doktor bulunamadı.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (randevuAdimi === "slot-sec") {
      const tarihler = doktoraVeHastaneyeGoreMusaitTarihler(
        hastaRandevuAkisi.doktorId,
        hastaRandevuAkisi.hastaneId,
        hastaRandevuAkisi.poliklinik
      );

      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Randevu Saati Seçiniz</h3>
          </div>

          <div className="mhrs-list-panel">
            {tarihler.map(tarih => {
              const saatler = doktoraVeHastaneyeGoreSaatler(
                hastaRandevuAkisi.doktorId,
                hastaRandevuAkisi.hastaneId,
                hastaRandevuAkisi.poliklinik,
                tarih
              );

              return (
                <div key={tarih} className="mhrs-slot-group">
                  <div className="mhrs-slot-date">{formatTarih(tarih)}</div>
                  <div className="mhrs-slot-subtitle">
                    {hastaRandevuAkisi.poliklinik} • {seciliDoktor?.ad}
                  </div>

                  <div className="mhrs-slot-grid">
                    {saatler.map(slot => (
                      <button
                        key={slot.id}
                        className="mhrs-slot-btn"
                        onClick={() => handleHastaSlotSec(slot.id)}
                      >
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

    if (randevuAdimi === "onay" && randevuOzeti) {
      return (
        <div className="mhrs-flow-shell">
          <div className="mhrs-step-top">
            <button className="mhrs-back-btn" onClick={geriGitRandevuAkisi}>←</button>
            <h3>Randevuyu Onayla</h3>
          </div>

          <div className="mhrs-confirm-card">
            <div className="mhrs-confirm-row">
              <span>Tarih</span>
              <strong>{formatTarih(randevuOzeti.slot.tarih)}</strong>
            </div>
            <div className="mhrs-confirm-row">
              <span>Saat</span>
              <strong>{randevuOzeti.slot.saat}</strong>
            </div>
            <div className="mhrs-confirm-divider" />
            <div className="mhrs-confirm-block">
              <p><b>Hastane:</b> {randevuOzeti.hastane.ad}</p>
              <p><b>Poliklinik:</b> {randevuOzeti.poliklinik}</p>
              <p><b>Doktor:</b> {randevuOzeti.doktor.ad}</p>
              <p><b>Randevu Sahibi:</b> {girisYapanKullanici.adSoyad}</p>
            </div>
          </div>

          <button className="mhrs-confirm-btn" onClick={handleRandevuAl}>
            Randevuyu Onayla
          </button>
        </div>
      );
    }

    return null;
  };

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
          resetHastaRandevuAkisi();
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

              {girisYapanKullanici.rol === "HASTA" ? (
                renderHastaRandevuAkisi()
              ) : (
                <div className="table-container">
                  <h3 style={{ marginBottom: '8px' }}>Sistem Özeti</h3>
                  <p style={{ color: '#64748b' }}>
                    Bu panel üzerinden profil, randevu ve çalışma takvimi işlemlerinizi yönetebilirsiniz.
                  </p>
                </div>
              )}
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
                  Hastane, gün ve saat seçerek kendi uygunluk planınızı oluşturun. Hastalar yalnızca bu slotları görür.
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
                        <select
                          className="login-input"
                          value={doktorTakvimFormu.hastaneId}
                          onChange={(e) =>
                            setDoktorTakvimFormu(prev => ({
                              ...prev,
                              hastaneId: e.target.value,
                              seciliSaatler: []
                            }))
                          }
                        >
                          <option value="">Hastane seçiniz</option>
                          {HASTANELER.map(h => (
                            <option key={h.id} value={h.id}>{h.ad}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="schedule-date-card">
                          <label className="schedule-label">Gün Seçiniz</label>

                          <div className="schedule-date-input-wrap">
                            <span className="schedule-date-icon">📅</span>
                            <input
                              type="date"
                              className="schedule-date-input"
                              value={doktorTakvimFormu.tarih}
                              onChange={(e) =>
                                setDoktorTakvimFormu(prev => ({
                                  ...prev,
                                  tarih: e.target.value,
                                  seciliSaatler: []
                                }))
                              }
                            />
                          </div>

                          <div className="schedule-date-preview">
                            {doktorTakvimFormu.tarih
                              ? `Seçilen gün: ${formatTarih(doktorTakvimFormu.tarih)}`
                              : "Henüz bir gün seçilmedi"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <label className="schedule-label">Saat Seçiniz</label>
                      <div className="schedule-time-grid">
                        {SAAT_SECENEKLERI.map(saat => (
                          <button
                            type="button"
                            key={saat}
                            className={`schedule-time-chip ${doktorTakvimFormu.seciliSaatler.includes(saat) ? 'active' : ''}`}
                            onClick={() => doktorSaatSeciminiDegistir(saat)}
                          >
                            {saat}
                          </button>
                        ))}
                      </div>

                      <div className="schedule-selected-info">
                        {doktorTakvimFormu.seciliSaatler.length > 0
                          ? `Seçilen saatler: ${doktorTakvimFormu.seciliSaatler.join(", ")}`
                          : "Henüz saat seçilmedi"}
                      </div>
                    </div>

                    <button
                      className="login-submit-btn"
                      style={{ marginTop: '16px' }}
                      onClick={doktorTakvimeSlotEkle}
                    >
                      Seçili Slotları Ekle
                    </button>
                  </div>

                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Hastane</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {randevuSlotlari
                        .filter(slot => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id))
                        .sort(slotSirala)
                        .map(slot => {
                          const hastane = HASTANELER.find(h => Number(h.id) === Number(slot.hastaneId));
                          return (
                            <tr key={slot.id}>
                              <td>{hastane?.ad || "Hastane Yok"}</td>
                              <td>{formatTarih(slot.tarih)}</td>
                              <td>{slot.saat}</td>
                              <td>
                                <span className={`status-badge ${slot.durum === "MUSAIT" ? "status-active" : "status-pending"}`}>
                                  {slot.durum}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => doktorSlotSil(slot.id)}
                                  style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Sil
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                      {randevuSlotlari.filter(slot => Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id)).length === 0 && (
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

export default App;