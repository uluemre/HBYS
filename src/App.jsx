import { useState, useMemo, useCallback } from "react"; import "./App.css";

// ─── Hooks ────────────────────────────────────────────────────────────────────
import { useAuth } from "./hooks/useAuth";
import { useRandevu } from "./hooks/useRandevu";
import { useMuayene } from "./hooks/useMuayene";
import { useDoktorTakvim } from "./hooks/useDoktorTakvim";

// ─── Bileşenler ───────────────────────────────────────────────────────────────
import { Login } from "./components/login/index.jsx";
import { Sidebar } from "./components/sidebar";
import ParkingLot from "./components/ParkingLot";
import { PatientProfileInfo, DoctorProfileInfo } from "./components/profile/ProfileComponents";
import { TableRandevular, TableTahliller, TableYatislar, TableSikayet, TablePersonel, TableReceteler } from "./components/tables/index.js";
import HastaRandevuAkisi from "./components/hasta/HastaRandevuAkisi";
import MuayeneSurecleri from "./components/doktor/MuayeneSurecleri";
import CalismaTakvimi from "./components/doktor/CalismaTakvimi";
import {
  BashekimDashboard,
  BashekimSikayetleri,
  BashekimNobetleri,
  BashekimPerformansAnalizi,
} from "./components/bashekim/BashekimPaneller";

// ─── Sabitler ─────────────────────────────────────────────────────────────────
import { DOKTOR_LISTESI, DOKTOR_HAVUZU } from "./constants/doktorlar";
import { BASHEKIM_DEMO_SIKAYETLERI } from "./constants/hastaneler";
import { normalizeText, slotSirala } from "./utils/helpers";
import { apiMuayeneUcretiGuncelle } from "./api";
import {
  haftaBaslangici, haftaBitisi, ayBaslangici, ayBitisi, tarihAraliktaMi,
} from "./hooks/useDoktorTakvim";

const MIN_MUAYENE_UCRETI = 1000;
const MAX_MUAYENE_UCRETI = 3000;

export default function App() {
  const bugunString = new Date().toISOString().split("T")[0];

  // ─── Hooks ──────────────────────────────────────────────────────────────────
  const auth = useAuth();
  const { girisYapanKullanici, setGirisYapanKullanici, yukleniyor, cikisYap } = auth;

  const [aktifSekme, setAktifSekme] = useState("Ana Sayfa");

  const randevu = useRandevu(girisYapanKullanici, setAktifSekme);
  const { randevuListesi, setRandevuListesi, randevuSlotlari, setRandevuSlotlari } = randevu;

  const muayene = useMuayene(randevuListesi, setRandevuListesi);

  const takvim = useDoktorTakvim(
    randevuSlotlari,
    setRandevuSlotlari,
    muayene.muayeneKayitlari,
    randevuListesi
  );

  // ─── Muayene ücreti state ────────────────────────────────────────────────────
  const [muayeneUcretiInput, setMuayeneUcretiInput] = useState(
    girisYapanKullanici?.muayeneUcreti != null
      ? String(girisYapanKullanici.muayeneUcreti)
      : ""
  );
  const [ucretGuncelleniyor, setUcretGuncelleniyor] = useState(false);

  // ─── Performans filtre state ─────────────────────────────────────────────────
  const [performansFiltreTipi, setPerformansFiltreTipi] = useState("haftalik");
  const [performansReferansTarihi, setPerformansReferansTarihi] = useState(bugunString);
  const [performansBaslangic, setPerformansBaslangic] = useState(bugunString);
  const [performansBitis, setPerformansBitis] = useState(bugunString);

  // ─── Aktif doktor demo kaydı ─────────────────────────────────────────────────
  const aktifDoktorDemoKaydi = useMemo(() => {
    if (!girisYapanKullanici || !["DOKTOR", "BASHEKIM"].includes(girisYapanKullanici.rol))
      return null;

    return (
      DOKTOR_LISTESI.find(
        (d) => normalizeText(d.ad) === normalizeText(girisYapanKullanici.adSoyad)
      ) ||
      DOKTOR_LISTESI.find(
        (d) =>
          normalizeText(d.poliklinik) ===
          normalizeText(
            girisYapanKullanici.poliklinikIsmi || girisYapanKullanici.brans || ""
          )
      ) ||
      null
    );
  }, [girisYapanKullanici]);

  // ─── useMemo hesaplamalar ────────────────────────────────────────────────────

  const goruntulenecekRandevular = useMemo(
    () =>
      girisYapanKullanici?.rol === "DOKTOR" && aktifDoktorDemoKaydi
        ? randevuListesi.filter(
          (r) => Number(r.doktorId) === Number(aktifDoktorDemoKaydi.id)
        )
        : randevuListesi,
    [girisYapanKullanici, aktifDoktorDemoKaydi, randevuListesi]
  );

  // 🔥 muayene komple eklendi
  const hastaTahlilGorunumu = useMemo(
    () => muayene.buildHastaTahlilGorunumu(girisYapanKullanici),
    [girisYapanKullanici, muayene]
  );
  const hastaReceteGorunumu = useMemo(
    () => muayene.buildHastaReceteGorunumu(girisYapanKullanici),
    [girisYapanKullanici, muayene]
  );
  // 🔥 aynı mantık
  const doktorMuayeneSurecleri = useMemo(
    () => muayene.buildDoktoraMuayeneSurecleri(aktifDoktorDemoKaydi),
    [aktifDoktorDemoKaydi, muayene]
  );

  // 🔥 useCallback şart
  const tarihAraligiGetir = useCallback(() => {
    if (performansFiltreTipi === "gunluk")
      return { bas: performansReferansTarihi, bit: performansReferansTarihi };
    if (performansFiltreTipi === "haftalik")
      return {
        bas: haftaBaslangici(performansReferansTarihi),
        bit: haftaBitisi(performansReferansTarihi),
      };
    if (performansFiltreTipi === "aylik")
      return {
        bas: ayBaslangici(performansReferansTarihi),
        bit: ayBitisi(performansReferansTarihi),
      };
    return { bas: performansBaslangic, bit: performansBitis };
  }, [
    performansFiltreTipi,
    performansReferansTarihi,
    performansBaslangic,
    performansBitis,
  ]);

  // 🔥 takvim komple eklendi + function
  const bashekimPerformanslar = useMemo(() => {
    const { bas, bit } = tarihAraligiGetir();

    return DOKTOR_LISTESI.map((d) => {
      const doktorRandevular = randevuListesi.filter(
        (r) =>
          Number(r.doktorId) === Number(d.id) &&
          tarihAraliktaMi(r.tarih, bas, bit)
      );

      const slotlar = randevuSlotlari.filter(
        (s) =>
          Number(s.doktorId) === Number(d.id) &&
          tarihAraliktaMi(s.tarih, bas, bit)
      );

      const tamamlanan = muayene.muayeneKayitlari.filter((m) => {
        const r = randevuListesi.find(
          (r2) => String(r2.id) === String(m.randevuId)
        );
        return (
          Number(m.doktorId) === Number(d.id) &&
          r &&
          tarihAraliktaMi(r.tarih, bas, bit) &&
          m.durum === "TAMAMLANDI"
        );
      });

      const nobetler = takvim.nobetListesi.filter(
        (n) =>
          normalizeText(n.doktor) === normalizeText(d.ad) &&
          tarihAraliktaMi(n.tarih, bas, bit)
      );

      const toplam = takvim.slotSaatToplami(slotlar);
      const hedef = takvim.doktorunHedefSaati(d.id);

      return {
        doktorId: d.id,
        doktor: d.ad,
        unvan: d.unvan,
        poliklinik: d.poliklinik,
        hastaSayisi: doktorRandevular.length,
        aktifSlotSayisi: slotlar.filter((s) => s.durum === "MUSAIT").length,
        toplamSaat: toplam,
        aktifGunSayisi: new Set(slotlar.map((s) => s.tarih)).size,
        tamamlananMuayeneSayisi: tamamlanan.length,
        nobetSayisi: nobetler.length,
        dolulukOrani:
          hedef > 0
            ? Math.min(Math.round((toplam / hedef) * 100), 999)
            : 0,
        dolulukPuani:
          doktorRandevular.length * 8 +
          toplam * 2 +
          tamamlanan.length * 5,
      };
    }).sort((a, b) => b.dolulukPuani - a.dolulukPuani);
  }, [
    randevuListesi,
    randevuSlotlari,
    muayene,
    takvim,
    tarihAraligiGetir,
  ]);

  // ✅ doğru zaten
  const poliklinikOzeti = useMemo(() => {
    return Object.keys(DOKTOR_HAVUZU)
      .map((pol) => {
        const randevuSayisi = randevuListesi.filter(
          (r) => r.poliklinik === pol
        ).length;
        const musaitSlot = randevuSlotlari.filter(
          (s) => s.poliklinik === pol && s.durum === "MUSAIT"
        ).length;

        return {
          poliklinik: pol,
          randevuSayisi,
          musaitSlot,
          seviye:
            randevuSayisi >= 5
              ? "Yoğun"
              : randevuSayisi >= 2
                ? "Orta"
                : "Düşük",
        };
      })
      .filter((i) => i.randevuSayisi > 0 || i.musaitSlot > 0)
      .sort((a, b) => b.randevuSayisi - a.randevuSayisi);
  }, [randevuListesi, randevuSlotlari]);

  // 🔥 bugunString eklendi
  const sistemOzeti = useMemo(
    () => ({
      bugunkuRandevu: randevuListesi.filter(
        (r) => r.tarih === bugunString
      ).length,
      acikSikayet: BASHEKIM_DEMO_SIKAYETLERI.filter(
        (s) => s.durum === "Açık"
      ).length,
      aktifDoktorSayisi: new Set(
        randevuSlotlari.map((s) => s.doktorId)
      ).size,
      toplamHekim: DOKTOR_LISTESI.length,
      toplamHastaRandevu: randevuListesi.length,
    }),
    [randevuListesi, randevuSlotlari, bugunString]
  );

  // 🔥 takvim komple
  const haftalikOzet = useMemo(
    () => takvim.aktifDoktorHaftalikOzeti(aktifDoktorDemoKaydi),
    [aktifDoktorDemoKaydi, takvim]
  );
  // ─── Muayene ücreti güncelle ─────────────────────────────────────────────────
  const handleMuayeneUcretiGuncelle = async () => {
    const yeniUcret = Number(muayeneUcretiInput);
    if (!muayeneUcretiInput || Number.isNaN(yeniUcret)) return alert("Geçerli bir muayene ücreti giriniz.");
    if (yeniUcret < MIN_MUAYENE_UCRETI || yeniUcret > MAX_MUAYENE_UCRETI)
      return alert(`Muayene ücreti ${MIN_MUAYENE_UCRETI} TL ile ${MAX_MUAYENE_UCRETI} TL arasında olmalıdır.`);

    try {
      setUcretGuncelleniyor(true);
      const res = await apiMuayeneUcretiGuncelle(yeniUcret);
      const raw = await res.json().catch(() => ({}));
      if (!res.ok) return alert(raw?.message || "Muayene ücreti güncellenemedi.");
      setGirisYapanKullanici((prev) => ({ ...prev, muayeneUcreti: yeniUcret }));
      alert("Muayene ücreti başarıyla güncellendi.");
    } catch {
      alert("Sunucu bağlantı hatası.");
    } finally {
      setUcretGuncelleniyor(false);
    }
  };

  // ─── Yükleniyor ─────────────────────────────────────────────────────────────
  if (yukleniyor) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.2rem", color: "#64748b" }}>
        Yükleniyor...
      </div>
    );
  }

  // ─── Giriş ekranı ────────────────────────────────────────────────────────────
  if (!girisYapanKullanici) {
    return (
      <Login
        handleGiris={auth.handleGiris}
        tcNo={auth.tcNo} setTcNo={auth.setTcNo}
        sifre={auth.sifre} setSifre={auth.setSifre}
        hataMesaji={auth.hataMesaji}
        kayitModu={auth.kayitModu} setKayitModu={auth.setKayitModu}
        geriDon={() => auth.setKayitModu(false)}
        yeniHastaEkle={auth.yeniHastaEkle}
        beklemeSuresi={auth.beklemeSuresi}
        isBanned={auth.isBanned}
      />
    );
  }

  const rol = girisYapanKullanici.rol;

  // ─── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-wrapper">
      <Sidebar
        rol={rol}
        aktifSekme={aktifSekme}
        setAktifSekme={setAktifSekme}
        logout={() => { cikisYap(); randevu.resetAkis(); }}
      />

      <main className="main-content">
        <header className="content-header">
          <h2>{aktifSekme}</h2>
          <div className="user-info">
            <span className="user-name">{girisYapanKullanici.adSoyad}</span>
            <span className="user-role-tag">{rol}</span>
          </div>
        </header>

        <div className="tab-content">

          {/* ── Ana Sayfa ── */}
          {aktifSekme === "Ana Sayfa" && rol === "HASTA" && (
            <>
              <div className="mhrs-banner">Hoş Geldiniz, {girisYapanKullanici.adSoyad}</div>
              <HastaRandevuAkisi
                randevuAdimi={randevu.randevuAdimi}
                hastaRandevuAkisi={randevu.hastaRandevuAkisi}
                randevuListesi={randevuListesi}
                randevuOzeti={randevu.randevuOzeti}
                bulunanKonum={randevu.bulunanKonum}
                konumYukleniyor={randevu.konumYukleniyor}
                seciliIl={randevu.seciliIl}
                seciliHastane={randevu.seciliHastane}
                seciliDoktor={randevu.seciliDoktor}
                girisYapanKullanici={girisYapanKullanici}
                poliklinigeGoreHastaneler={randevu.poliklinigeGoreHastaneler}
                konumaSiraliHastaneler={randevu.konumaSiraliHastaneler}
                hastaneyeGorePoliklinikler={randevu.hastaneyeGorePoliklinikler}
                hastanePoliklinigeGoreDoktorlar={randevu.hastanePoliklinigeGoreDoktorlar}
                musaitTarihler={randevu.musaitTarihler}
                tariheSaatler={randevu.tariheSaatler}
                randevuEngeliKontrol={randevu.randevuEngeliKontrol}
                geriGit={randevu.geriGit}
                aramaTuruSec={randevu.aramaTuruSec}
                ilSec={randevu.ilSec}
                poliklinikSec={randevu.poliklinikSec}
                hastaneSec={randevu.hastaneSec}
                doktorSec={randevu.doktorSec}
                slotSec={randevu.slotSec}
                randevuAl={randevu.randevuAl}
                konumuTespitEt={randevu.konumuTespitEt}
              />
            </>
          )}
          {aktifSekme === "Ana Sayfa" && rol === "BASHEKIM" && (
            <BashekimDashboard
              adSoyad={girisYapanKullanici.adSoyad}
              sistemOzeti={sistemOzeti}
              performanslar={bashekimPerformanslar}
              setAktifSekme={setAktifSekme}
            />
          )}
          {aktifSekme === "Ana Sayfa" && !["HASTA", "BASHEKIM"].includes(rol) && (
            <div className="table-container">
              <h3 style={{ marginBottom: 8 }}>Sistem Özeti</h3>
              <p style={{ color: "#64748b" }}>Bu panel üzerinden profil, randevu ve çalışma takvimi işlemlerinizi yönetebilirsiniz.</p>
            </div>
          )}

          {/* ── Profil ── */}
          {aktifSekme === "Kişisel Bilgiler" && rol === "HASTA" && <PatientProfileInfo hasta={girisYapanKullanici} />}
          {aktifSekme === "Kişisel Bilgiler" && rol === "PERSONEL" && <TablePersonel personel={girisYapanKullanici} />}
          {aktifSekme === "Doktor Bilgileri" && rol === "DOKTOR" && <DoctorProfileInfo doktor={girisYapanKullanici} baslik="SAĞLIK PERSONELİ" />}
          {(aktifSekme === "Başhekim Profili" || (aktifSekme === "Doktor Bilgileri" && rol === "BASHEKIM")) && (
            <DoctorProfileInfo doktor={girisYapanKullanici} baslik="BAŞHEKİM" />
          )}

          {/* ── Randevu / Tahlil ── */}
          {aktifSekme === "Randevularım" && (
            <TableRandevular
              veriler={goruntulenecekRandevular}
              onIptal={rol === "HASTA" ? randevu.randevuIptal : undefined}
            />
          )}          {aktifSekme === "Tahlillerim" && <TableTahliller veriler={hastaTahlilGorunumu} />}
          {aktifSekme === "Reçetelerim" && <TableReceteler veriler={hastaReceteGorunumu} />}
          {/* ── Doktor panelleri ── */}
          {aktifSekme === "Muayene Süreçleri" && rol === "DOKTOR" && (
            <MuayeneSurecleri
              surecleri={doktorMuayeneSurecleri}
              hastaGeldiIsaretle={muayene.hastaGeldiIsaretle}
              muayeneBaslat={muayene.muayeneBaslat}
              tahlilIste={muayene.tahlilIste}
              numuneVerildiIsaretle={muayene.numuneVerildiIsaretle}
              tahlilSonucuHazirla={muayene.tahlilSonucuHazirla}
              sonucuIncele={muayene.sonucuIncele}
              receteYaz={muayene.receteYaz}
              muayeneTamamla={muayene.muayeneTamamla}
              buildHastaGecmisi={muayene.buildHastaGecmisi}
            />
          )}
          {aktifSekme === "Çalışma Takvimi" && rol === "DOKTOR" && (
            <CalismaTakvimi
              aktifDoktorDemoKaydi={aktifDoktorDemoKaydi}
              randevuSlotlari={randevuSlotlari}
              doktorTakvimFormu={takvim.doktorTakvimFormu}
              setDoktorTakvimFormu={takvim.setDoktorTakvimFormu}
              doktorHaftalikPlanlari={takvim.doktorHaftalikPlanlari}
              setDoktorHaftalikPlanlari={takvim.setDoktorHaftalikPlanlari}
              haftalikOzet={haftalikOzet}
              muayeneUcreti={girisYapanKullanici.muayeneUcreti}
              muayeneUcretiInput={muayeneUcretiInput}
              setMuayeneUcretiInput={setMuayeneUcretiInput}
              ucretGuncelleniyor={ucretGuncelleniyor}
              onUcretGuncelle={handleMuayeneUcretiGuncelle}
              onSlotEkle={() => takvim.slotEkle(aktifDoktorDemoKaydi)}
              onSlotSil={takvim.slotSil}
              onHaftalikHedefKaydet={() =>
                takvim.haftalikHedefGuncelle(
                  aktifDoktorDemoKaydi.id,
                  takvim.doktorHaftalikPlanlari[aktifDoktorDemoKaydi.id]?.hedefSaat
                )
              }
              saatSeciminiDegistir={takvim.saatSeciminiDegistir}
              VARSAYILAN_HEDEF={takvim.VARSAYILAN_HEDEF}
              MIN_HAFTALIK={takvim.MIN_HAFTALIK}
              MAX_HAFTALIK={takvim.MAX_HAFTALIK}
              slotSirala={slotSirala}
            />
          )}

          {/* ── Başhekim panelleri ── */}
          {(aktifSekme === "Şikayet/Öneri Yönetimi" || (aktifSekme === "Şikayet/Öneri" && rol === "BASHEKIM")) && (
            <BashekimSikayetleri />
          )}
          {aktifSekme === "Nöbet ve Çalışma Çizelgesi" && rol === "BASHEKIM" && (
            <BashekimNobetleri
              bashekimCalismaOzeti={takvim.bashekimCalismaOzeti}
              nobetListesi={takvim.nobetListesi}
              onNobetAta={takvim.nobetAta}
              onOtomatikNobetOnerisi={takvim.otomatikNobetOnerisi}
            />
          )}
          {aktifSekme === "Performans Analizi" && rol === "BASHEKIM" && (
            <BashekimPerformansAnalizi
              performanslar={bashekimPerformanslar}
              poliklinikOzeti={poliklinikOzeti}
              sistemOzeti={sistemOzeti}
              filtreTipi={performansFiltreTipi} setFiltreTipi={setPerformansFiltreTipi}
              referansTarih={performansReferansTarihi} setReferansTarih={setPerformansReferansTarihi}
              baslangicTarih={performansBaslangic} setBaslangicTarih={setPerformansBaslangic}
              bitisTarih={performansBitis} setBitisTarih={setPerformansBitis}
            />
          )}

          {/* ── Ortak ── */}
          {aktifSekme === "Otopark Durumu" && <ParkingLot />}
          {aktifSekme === "Yatışlar" && <TableYatislar />}
          {aktifSekme === "Şikayet/Öneri" && rol !== "BASHEKIM" && <TableSikayet />}
          {aktifSekme === "Personel" && rol !== "PERSONEL" && <TablePersonel personel={null} />}

        </div>
      </main>
    </div>
  );
}