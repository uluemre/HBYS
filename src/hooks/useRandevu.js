import { useState, useEffect } from "react";
import { HASTANELER } from "../constants/hastaneler";
import { DOKTOR_HAVUZU, DOKTOR_LISTESI } from "../constants/doktorlar";
import { slotSirala, createInitialSlots, futureDate, formatTarih } from "../utils/helpers";
import { apiRandevuOlustur } from "../api";

const RANDEVU_BLOKAJ_GUN = 2;

const aktifSurecDurumlari = [
    "ONAYLANDI", "HASTA_GELDI", "MUAYENEDE",
    "TAHLIL_BEKLENIYOR", "TAHLIL_ISTENDI",
    "SONUC_INCELENIYOR", "DOKTOR_INCELEDI", "RECETE_YAZILDI",
];

const tarihFarkiGun = (t1, t2) => {
    const d1 = new Date(`${t1}T00:00:00`);
    const d2 = new Date(`${t2}T00:00:00`);
    return Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
};

export function useRandevu(girisYapanKullanici, setAktifSekme) {
    const bugunString = new Date().toISOString().split("T")[0];

    // ─── State ────────────────────────────────────────────────────────────────
    const [randevuAdimi, setRandevuAdimi] = useState("ana");
    const [hastaRandevuAkisi, setHastaRandevuAkisi] = useState({
        aramaTuru: "", il: "", poliklinik: "", hastaneId: "", doktorId: "", slotId: "",
    });

    const [randevuListesi, setRandevuListesi] = useState(() => {
        const k = localStorage.getItem("hastane_randevular");
        return k
            ? JSON.parse(k)
            : [
                {
                    id: "#1284",
                    hastaId: 1,
                    poliklinik: "Göz Hastalıkları",
                    doktor: "Dr. Ali Bakış",
                    doktorId: 5,
                    hastane: "İstanbul Şehir Hastanesi",
                    tarih: futureDate(1),
                    saat: "10:30",
                    durum: "ONAYLANDI",
                    sikayet: "Sistem üzerinden randevu alındı.",
                },
            ];
    });

    const [randevuSlotlari, setRandevuSlotlari] = useState(() => {
        const k = localStorage.getItem("hastane_randevu_slotlari");
        return k ? JSON.parse(k) : createInitialSlots();
    });

    const [bulunanKonum, setBulunanKonum] = useState({
        il: "", ilce: "", detay: "", latitude: null, longitude: null,
    });
    const [konumYukleniyor, setKonumYukleniyor] = useState(false);
    const [seciliIl, setSeciliIl] = useState("");

    useEffect(() => {
        localStorage.setItem("hastane_randevular", JSON.stringify(randevuListesi));
    }, [randevuListesi]);

    useEffect(() => {
        localStorage.setItem("hastane_randevu_slotlari", JSON.stringify(randevuSlotlari));
    }, [randevuSlotlari]);

    // ─── Seçili öğeler ────────────────────────────────────────────────────────
    const seciliHastane = HASTANELER.find(
        (h) => String(h.id) === String(hastaRandevuAkisi.hastaneId)
    );
    const seciliDoktor = DOKTOR_LISTESI.find(
        (d) => String(d.id) === String(hastaRandevuAkisi.doktorId)
    );
    const seciliSlot = randevuSlotlari.find(
        (s) => String(s.id) === String(hastaRandevuAkisi.slotId)
    );
    const randevuOzeti =
        seciliHastane && seciliDoktor && seciliSlot
            ? {
                hastane: seciliHastane,
                doktor: seciliDoktor,
                slot: seciliSlot,
                poliklinik: hastaRandevuAkisi.poliklinik,
            }
            : null;

    // ─── Engel kontrolü ───────────────────────────────────────────────────────
    const randevuEngeliKontrol = (hastaId, doktorId, hedefTarih = null) => {
        if (!hastaId || !doktorId) return null;

        const ayniDoktor = randevuListesi.filter(
            (r) =>
                Number(r.hastaId) === Number(hastaId) &&
                Number(r.doktorId) === Number(doktorId)
        );

        const aktif = ayniDoktor.find((r) => aktifSurecDurumlari.includes(r.durum));
        if (aktif)
            return {
                engelVar: true,
                mesaj: `Bu doktorda aktif bir süreciniz var (${formatTarih(aktif.tarih)} ${aktif.saat}). Muayene tamamlanmadan yeni randevu alamazsınız.`,
            };

        const tamamlanan = ayniDoktor
            .filter((r) => r.durum === "TAMAMLANDI")
            .sort(
                (a, b) =>
                    new Date(`${b.tarih}T${b.saat}`) - new Date(`${a.tarih}T${a.saat}`)
            );

        if (tamamlanan.length > 0) {
            const son = tamamlanan[0];
            const kontrolTarih = hedefTarih || bugunString;
            if (tarihFarkiGun(son.tarih, kontrolTarih) < RANDEVU_BLOKAJ_GUN)
                return {
                    engelVar: true,
                    mesaj: `Aynı doktordan tekrar randevu almak için en az ${RANDEVU_BLOKAJ_GUN} gün beklemelisiniz. Son muayene: ${formatTarih(son.tarih)}.`,
                };
        }

        return { engelVar: false, mesaj: "" };
    };

    // ─── Slot sorgu fonksiyonları ─────────────────────────────────────────────
    const musaitSlotlar = (doktorId, hastaneId = null, poliklinik = null) =>
        randevuSlotlari
            .filter(
                (s) =>
                    Number(s.doktorId) === Number(doktorId) &&
                    s.durum === "MUSAIT" &&
                    s.tarih >= bugunString &&
                    (!hastaneId || Number(s.hastaneId) === Number(hastaneId)) &&
                    (!poliklinik || s.poliklinik === poliklinik)
            )
            .sort(slotSirala);

    const ilkMusaitSlot = (doktorId, hastaneId, poliklinik) => {
        const list = musaitSlotlar(doktorId, hastaneId, poliklinik);
        return list.length > 0 ? list[0] : null;
    };

    const hastaneyeGorePoliklinikler = (hastaneId) =>
        [
            ...new Set(
                randevuSlotlari
                    .filter(
                        (s) =>
                            Number(s.hastaneId) === Number(hastaneId) &&
                            s.durum === "MUSAIT" &&
                            s.tarih >= bugunString
                    )
                    .map((s) => s.poliklinik)
            ),
        ].sort((a, b) => a.localeCompare(b, "tr"));

    const poliklinigeGoreHastaneler = (poliklinik) =>
        HASTANELER.filter((h) =>
            randevuSlotlari.some(
                (s) =>
                    Number(s.hastaneId) === Number(h.id) &&
                    s.poliklinik === poliklinik &&
                    s.durum === "MUSAIT" &&
                    s.tarih >= bugunString
            )
        );

    const ilaGoreHastaneler = (il) =>
        HASTANELER.filter(
            (h) =>
                h.il === il &&
                randevuSlotlari.some(
                    (s) =>
                        Number(s.hastaneId) === Number(h.id) &&
                        s.durum === "MUSAIT" &&
                        s.tarih >= bugunString
                )
        );

    const konumaSiraliHastaneler = (il) => {
        const list = ilaGoreHastaneler(il);
        if (
            typeof bulunanKonum.latitude !== "number" ||
            typeof bulunanKonum.longitude !== "number"
        ) {
            return list.map((h, i) => ({ ...h, mesafeKm: null, enYakinMi: i === 0 }));
        }

        const hesaplaMesafe = (lat1, lon1, lat2, lon2) => {
            const toRad = (d) => d * (Math.PI / 180);
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
            return Number((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
        };

        return list
            .map((h) => ({
                ...h,
                mesafeKm: hesaplaMesafe(
                    bulunanKonum.latitude,
                    bulunanKonum.longitude,
                    h.lat,
                    h.lon
                ),
            }))
            .sort((a, b) => (a.mesafeKm ?? Infinity) - (b.mesafeKm ?? Infinity))
            .map((h, i) => ({ ...h, enYakinMi: i === 0 }));
    };

    const hastanePoliklinigeGoreDoktorlar = (hastaneId, poliklinik) =>
        (DOKTOR_HAVUZU[poliklinik] || [])
            .filter((d) =>
                randevuSlotlari.some(
                    (s) =>
                        Number(s.hastaneId) === Number(hastaneId) &&
                        Number(s.doktorId) === Number(d.id) &&
                        s.poliklinik === poliklinik &&
                        s.durum === "MUSAIT" &&
                        s.tarih >= bugunString
                )
            )
            .map((d) => ({
                ...d,
                uygunSlotSayisi: musaitSlotlar(d.id, hastaneId, poliklinik).length,
                ilkMusaitSlot: ilkMusaitSlot(d.id, hastaneId, poliklinik),
            }));

    const musaitTarihler = (doktorId, hastaneId, poliklinik) => [
        ...new Set(musaitSlotlar(doktorId, hastaneId, poliklinik).map((s) => s.tarih)),
    ];

    const tariheSaatler = (doktorId, hastaneId, poliklinik, tarih) => {
        if (!tarih) return [];
        return randevuSlotlari
            .filter(
                (s) =>
                    Number(s.hastaneId) === Number(hastaneId) &&
                    Number(s.doktorId) === Number(doktorId) &&
                    s.poliklinik === poliklinik &&
                    s.tarih === tarih &&
                    s.durum === "MUSAIT"
            )
            .sort(slotSirala);
    };

    // ─── Akış handler'ları ────────────────────────────────────────────────────
    const resetAkis = () => {
        setHastaRandevuAkisi({
            aramaTuru: "", il: "", poliklinik: "", hastaneId: "", doktorId: "", slotId: "",
        });
        setRandevuAdimi("ana");
        setSeciliIl("");
    };

    const geriGit = () => {
        const { aramaTuru } = hastaRandevuAkisi;
        const adimMap = {
            "arama-turu": "ana",
            "konum-sec": "arama-turu",
            "hastane-sec": aramaTuru === "konum" ? "konum-sec" : "poliklinik-sec",
            "poliklinik-sec": aramaTuru === "konum" ? "hastane-sec" : "arama-turu",
            "doktor-sec": "poliklinik-sec",
            "slot-sec": "doktor-sec",
            onay: "slot-sec",
        };
        if (adimMap[randevuAdimi]) setRandevuAdimi(adimMap[randevuAdimi]);
    };

    const aramaTuruSec = (tur) => {
        setHastaRandevuAkisi({
            aramaTuru: tur,
            il: tur === "konum" ? bulunanKonum.il || seciliIl || "" : "",
            poliklinik: "", hastaneId: "", doktorId: "", slotId: "",
        });
        setRandevuAdimi(tur === "konum" ? "konum-sec" : "poliklinik-sec");
    };

    const ilSec = (il) => {
        setSeciliIl(il);
        setHastaRandevuAkisi((prev) => ({
            ...prev, il, hastaneId: "", poliklinik: "", doktorId: "", slotId: "",
        }));
        setRandevuAdimi("hastane-sec");
    };

    const poliklinikSec = (poliklinik) => {
        setHastaRandevuAkisi((prev) => ({ ...prev, poliklinik, doktorId: "", slotId: "" }));
        setRandevuAdimi(
            hastaRandevuAkisi.aramaTuru === "poliklinik" ? "hastane-sec" : "doktor-sec"
        );
    };

    const hastaneSec = (hastaneId) => {
        setHastaRandevuAkisi((prev) => ({
            ...prev,
            hastaneId,
            doktorId: "",
            slotId: "",
            ...(prev.aramaTuru === "konum" ? { poliklinik: "" } : {}),
        }));
        setRandevuAdimi(
            hastaRandevuAkisi.aramaTuru === "konum" ? "poliklinik-sec" : "doktor-sec"
        );
    };

    const doktorSec = (doktorId) => {
        setHastaRandevuAkisi((prev) => ({ ...prev, doktorId, slotId: "" }));
        setRandevuAdimi("slot-sec");
    };

    const slotSec = (slotId) => {
        const slot = randevuSlotlari.find((s) => String(s.id) === String(slotId));
        const hastaId = Number(girisYapanKullanici?.id);
        if (!slot || !hastaId) return alert("Slot bilgisi alınamadı.");

        const kontrol = randevuEngeliKontrol(hastaId, slot.doktorId, slot.tarih);
        if (kontrol?.engelVar) return alert(kontrol.mesaj);

        setHastaRandevuAkisi((prev) => ({ ...prev, slotId }));
        setRandevuAdimi("onay");
    };

    // ─── Konum tespiti ────────────────────────────────────────────────────────
    const konumuTespitEt = () => {
        setKonumYukleniyor(true);
        if (!navigator.geolocation) {
            setKonumYukleniyor(false);
            return alert("Tarayıcı konum özelliğini desteklemiyor.");
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const il = data.address.province || data.address.city || "Ankara";
                    const ilce = data.address.district || data.address.town || "Merkez";

                    setBulunanKonum({
                        il, ilce,
                        detay: `${data.address.suburb || ""} ${data.address.road || ""}`.trim(),
                        latitude, longitude,
                    });
                    setSeciliIl(il);
                    setHastaRandevuAkisi((prev) => ({
                        ...prev, il, hastaneId: "", poliklinik: "", doktorId: "", slotId: "",
                    }));
                    setRandevuAdimi("hastane-sec");
                } catch {
                    alert("Konum bilgisi alınırken hata oluştu.");
                } finally {
                    setKonumYukleniyor(false);
                }
            },
            () => {
                setKonumYukleniyor(false);
                alert("Konum erişimi reddedildi.");
            }
        );
    };

    // ─── Randevu al ───────────────────────────────────────────────────────────
    const randevuAl = async () => {
        if (!randevuOzeti) return alert("Randevu özeti oluşturulamadı.");

        const hastaId = Number(girisYapanKullanici?.id);
        const doluMu = randevuSlotlari.find(
            (s) =>
                Number(s.id) === Number(randevuOzeti.slot.id) && s.durum !== "MUSAIT"
        );
        if (doluMu) return alert("Bu slot artık uygun değil. Lütfen tekrar seçim yapınız.");

        const engel = randevuEngeliKontrol(
            hastaId,
            Number(randevuOzeti.doktor.id),
            randevuOzeti.slot.tarih
        );
        if (engel?.engelVar) return alert(engel.mesaj);

        try {
            const response = await apiRandevuOlustur({
                doktorId: Number(randevuOzeti.doktor.id),
                randevuTarihi: randevuOzeti.slot.tarih,
                randevuSaati: `${randevuOzeti.slot.saat}:00`,
                durum: "ONAYLANDI",
                sikayet: "Sistem üzerinden randevu alındı.",
            });

            if (response.ok) {
                setRandevuListesi((prev) => [
                    {
                        id: `#${Date.now()}`,
                        hastaId,
                        poliklinik: randevuOzeti.poliklinik,
                        doktor: randevuOzeti.doktor.ad,
                        doktorId: randevuOzeti.doktor.id,
                        hastane: randevuOzeti.hastane.ad,
                        tarih: randevuOzeti.slot.tarih,
                        saat: randevuOzeti.slot.saat,
                        durum: "ONAYLANDI",
                        sikayet: "Sistem üzerinden randevu alındı.",
                    },
                    ...prev,
                ]);
                setRandevuSlotlari((prev) =>
                    prev.map((s) =>
                        Number(s.id) === Number(randevuOzeti.slot.id)
                            ? { ...s, durum: "DOLU" }
                            : s
                    )
                );
                alert("✅ Randevunuz başarıyla oluşturuldu!");
                resetAkis();
                setAktifSekme("Randevularım");
            } else {
                const err = await response.json();
                alert(`DB Reddi: ${err.message || "Eksik Veri"}`);
            }
        } catch {
            alert("Sunucu bağlantı hatası!");
        }
    };

    return {
        // state
        randevuAdimi,
        setRandevuAdimi,
        hastaRandevuAkisi,
        randevuListesi,
        setRandevuListesi,
        randevuSlotlari,
        setRandevuSlotlari,
        bulunanKonum,
        konumYukleniyor,
        seciliIl,
        // seçili öğeler
        seciliHastane,
        seciliDoktor,
        seciliSlot,
        randevuOzeti,
        // sorgular
        musaitSlotlar,
        hastaneyeGorePoliklinikler,
        poliklinigeGoreHastaneler,
        konumaSiraliHastaneler,
        hastanePoliklinigeGoreDoktorlar,
        musaitTarihler,
        tariheSaatler,
        randevuEngeliKontrol,
        // handler'lar
        resetAkis,
        geriGit,
        aramaTuruSec,
        ilSec,
        poliklinikSec,
        hastaneSec,
        doktorSec,
        slotSec,
        konumuTespitEt,
        randevuAl,
    };
}