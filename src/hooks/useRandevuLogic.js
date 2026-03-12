import { useState, useEffect } from 'react';
import { HASTANELER, POLIKLINIKLER } from '../constants/hastaneler';
import { DOKTOR_HAVUZU, DOKTOR_LISTESI } from '../constants/doktorlar';
import { futureDate, slotSirala, createInitialSlots } from '../utils/helpers';

const BASE_URL = "http://192.168.233.106:8081/api";

export function useRandevuLogic(girisYapanKullanici, setAktifSekme) {
    const bugunString = new Date().toISOString().split('T')[0];

    const [randevuAdimi, setRandevuAdimi] = useState("ana");
    const [hastaRandevuAkisi, setHastaRandevuAkisi] = useState({
        aramaTuru: "",
        il: "",
        poliklinik: "",
        hastaneId: "",
        doktorId: "",
        slotId: "",
    });

    const [doktorTakvimFormu, setDoktorTakvimFormu] = useState({
        hastaneId: "",
        tarih: "",
        seciliSaatler: [],
    });

    const [randevuListesi, setRandevuListesi] = useState(() => {
        const kaydedilmis = localStorage.getItem("hastane_randevular");
        return kaydedilmis
            ? JSON.parse(kaydedilmis)
            : [
                {
                    id: "#1284",
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
        const kaydedilmisSlotlar = localStorage.getItem("hastane_randevu_slotlari");
        return kaydedilmisSlotlar ? JSON.parse(kaydedilmisSlotlar) : createInitialSlots();
    });

    const [seciliIl, setSeciliIl] = useState("");
    const [seciliPoliklinik, setSeciliPoliklinik] = useState("");
    const [aramaSonuclari, setAramaSonuclari] = useState([]);

    useEffect(() => {
        localStorage.setItem("hastane_randevular", JSON.stringify(randevuListesi));
    }, [randevuListesi]);

    useEffect(() => {
        localStorage.setItem("hastane_randevu_slotlari", JSON.stringify(randevuSlotlari));
    }, [randevuSlotlari]);

    // ─── Slot sorgu yardımcıları ───────────────────────────────────────────────

    const doktoraAitMusaitSlotlar = (doktorId, hastaneId, poliklinik) =>
        randevuSlotlari
            .filter(
                (slot) =>
                    Number(slot.doktorId) === Number(doktorId) &&
                    Number(slot.hastaneId) === Number(hastaneId) &&
                    slot.poliklinik === poliklinik &&
                    slot.durum === "MUSAIT" &&
                    slot.tarih >= bugunString
            )
            .sort(slotSirala);

    const doktoraAitIlkMusaitSlot = (doktorId, hastaneId, poliklinik) => {
        const slotlar = doktoraAitMusaitSlotlar(doktorId, hastaneId, poliklinik);
        return slotlar.length > 0 ? slotlar[0] : null;
    };

    const hastaneyeGoreUygunPoliklinikler = (hastaneId) =>
        [
            ...new Set(
                randevuSlotlari
                    .filter(
                        (slot) =>
                            Number(slot.hastaneId) === Number(hastaneId) &&
                            slot.durum === "MUSAIT" &&
                            slot.tarih >= bugunString
                    )
                    .map((slot) => slot.poliklinik)
            ),
        ].sort((a, b) => a.localeCompare(b, 'tr'));

    const poliklinigeGoreUygunHastaneler = (poliklinik) =>
        HASTANELER.filter((hastane) =>
            randevuSlotlari.some(
                (slot) =>
                    Number(slot.hastaneId) === Number(hastane.id) &&
                    slot.poliklinik === poliklinik &&
                    slot.durum === "MUSAIT" &&
                    slot.tarih >= bugunString
            )
        );

    const konumaGoreUygunHastaneler = (il) =>
        HASTANELER.filter(
            (hastane) =>
                hastane.il === il &&
                randevuSlotlari.some(
                    (slot) =>
                        Number(slot.hastaneId) === Number(hastane.id) &&
                        slot.durum === "MUSAIT" &&
                        slot.tarih >= bugunString
                )
        );

    const hastaneVePoliklinigeGoreDoktorlar = (hastaneId, poliklinik) =>
        (DOKTOR_HAVUZU[poliklinik] || [])
            .filter((doc) =>
                randevuSlotlari.some(
                    (slot) =>
                        Number(slot.hastaneId) === Number(hastaneId) &&
                        Number(slot.doktorId) === Number(doc.id) &&
                        slot.poliklinik === poliklinik &&
                        slot.durum === "MUSAIT" &&
                        slot.tarih >= bugunString
                )
            )
            .map((doc) => ({
                ...doc,
                uygunSlotSayisi: doktoraAitMusaitSlotlar(doc.id, hastaneId, poliklinik).length,
                ilkMusaitSlot: doktoraAitIlkMusaitSlot(doc.id, hastaneId, poliklinik),
            }));

    const doktoraVeHastaneyeGoreMusaitTarihler = (doktorId, hastaneId, poliklinik) => {
        const slotlar = doktoraAitMusaitSlotlar(doktorId, hastaneId, poliklinik);
        return [...new Set(slotlar.map((slot) => slot.tarih))];
    };

    const doktoraVeHastaneyeGoreSaatler = (doktorId, hastaneId, poliklinik, secilenTarih) => {
        if (!secilenTarih) return [];
        return randevuSlotlari
            .filter(
                (slot) =>
                    Number(slot.hastaneId) === Number(hastaneId) &&
                    Number(slot.doktorId) === Number(doktorId) &&
                    slot.poliklinik === poliklinik &&
                    slot.tarih === secilenTarih &&
                    slot.durum === "MUSAIT"
            )
            .sort(slotSirala);
    };

    // ─── Akış handler'ları ─────────────────────────────────────────────────────

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
        if (randevuAdimi === "hastane-sec")
            return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "konum-sec" : "poliklinik-sec");
        if (randevuAdimi === "poliklinik-sec")
            return setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "hastane-sec" : "arama-turu");
        if (randevuAdimi === "doktor-sec") return setRandevuAdimi("poliklinik-sec");
        if (randevuAdimi === "slot-sec") return setRandevuAdimi("doktor-sec");
        if (randevuAdimi === "onay") return setRandevuAdimi("slot-sec");
    };

    const handleAramaTuruSec = (tur, bulunanKonum) => {
        setHastaRandevuAkisi({
            aramaTuru: tur,
            il: tur === "konum" ? (bulunanKonum?.il || seciliIl || "") : "",
            poliklinik: "",
            hastaneId: "",
            doktorId: "",
            slotId: "",
        });
        setRandevuAdimi(tur === "konum" ? "konum-sec" : "poliklinik-sec");
    };

    const handleHastaIlSec = (il) => {
        setSeciliIl(il);
        setHastaRandevuAkisi((prev) => ({ ...prev, il, hastaneId: "", poliklinik: "", doktorId: "", slotId: "" }));
        setRandevuAdimi("hastane-sec");
    };

    const handleHastaPoliklinikSec = (poliklinik) => {
        setSeciliPoliklinik(poliklinik);
        setHastaRandevuAkisi((prev) => ({ ...prev, poliklinik, doktorId: "", slotId: "" }));
        setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "poliklinik" ? "hastane-sec" : "doktor-sec");
    };

    const handleHastaHastaneSec = (hastaneId) => {
        setHastaRandevuAkisi((prev) => ({
            ...prev,
            hastaneId,
            doktorId: "",
            slotId: "",
            ...(prev.aramaTuru === "konum" ? { poliklinik: "" } : {}),
        }));
        setRandevuAdimi(hastaRandevuAkisi.aramaTuru === "konum" ? "poliklinik-sec" : "doktor-sec");
    };

    const handleHastaDoktorSec = (doktorId) => {
        setHastaRandevuAkisi((prev) => ({ ...prev, doktorId, slotId: "" }));
        setRandevuAdimi("slot-sec");
    };

    const handleHastaSlotSec = (slotId) => {
        setHastaRandevuAkisi((prev) => ({ ...prev, slotId }));
        setRandevuAdimi("onay");
    };

    // ─── Randevu al (API) ──────────────────────────────────────────────────────

    const handleRandevuAl = async (randevuOzeti) => {
        if (!randevuOzeti) return alert("Randevu özeti oluşturulamadı.");

        const token = localStorage.getItem("token");

        const ayniSlotDoluMu = randevuSlotlari.find(
            (slot) => Number(slot.id) === Number(randevuOzeti.slot.id) && slot.durum !== "MUSAIT"
        );
        if (ayniSlotDoluMu) return alert("Bu slot artık uygun değil. Lütfen tekrar seçim yapınız.");

        const randevuPaketi = {
            doktorId: Number(randevuOzeti.doktor.id),
            randevuTarihi: randevuOzeti.slot.tarih,
            randevuSaati: `${randevuOzeti.slot.saat}:00`,
            durum: "ONAYLANDI",
            sikayet: "Sistem üzerinden randevu alındı.",
        };

        try {
            const response = await fetch(`${BASE_URL}/randevular`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(randevuPaketi),
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
                    sikayet: "Sistem üzerinden randevu alındı.",
                };
                setRandevuListesi((prev) => [yeniRandevu, ...prev]);
                setRandevuSlotlari((prev) =>
                    prev.map((slot) =>
                        Number(slot.id) === Number(randevuOzeti.slot.id) ? { ...slot, durum: "DOLU" } : slot
                    )
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

    // ─── Doktor takvim işlemleri ───────────────────────────────────────────────

    const doktorSlotEkle = (aktifDoktorDemoKaydi) => {
        if (!doktorTakvimFormu.hastaneId) return alert("Lütfen hastane seçiniz.");
        if (!doktorTakvimFormu.tarih) return alert("Lütfen tarih seçiniz.");
        if (doktorTakvimFormu.seciliSaatler.length === 0) return alert("Lütfen en az bir saat seçiniz.");

        const mevcutSaatler = randevuSlotlari
            .filter(
                (slot) =>
                    Number(slot.hastaneId) === Number(doktorTakvimFormu.hastaneId) &&
                    Number(slot.doktorId) === Number(aktifDoktorDemoKaydi.id) &&
                    slot.tarih === doktorTakvimFormu.tarih
            )
            .map((slot) => slot.saat);

        const yeniSaatler = doktorTakvimFormu.seciliSaatler.filter((s) => !mevcutSaatler.includes(s));

        if (yeniSaatler.length === 0) return alert("Seçtiğiniz saatlerin tamamı zaten eklenmiş.");

        const yeniSlotlar = yeniSaatler.map((saat, index) => ({
            id: Date.now() + index,
            hastaneId: Number(doktorTakvimFormu.hastaneId),
            doktorId: Number(aktifDoktorDemoKaydi.id),
            poliklinik: aktifDoktorDemoKaydi.poliklinik,
            tarih: doktorTakvimFormu.tarih,
            saat,
            durum: "MUSAIT",
        }));

        setRandevuSlotlari((prev) => [...prev, ...yeniSlotlar].sort(slotSirala));

        const eklenemeyenSaatler = doktorTakvimFormu.seciliSaatler.filter((s) => mevcutSaatler.includes(s));
        setDoktorTakvimFormu((prev) => ({ ...prev, seciliSaatler: [] }));

        if (eklenemeyenSaatler.length > 0) {
            alert(`✅ ${yeniSaatler.length} slot eklendi.\n⚠️ Zaten kayıtlı: ${eklenemeyenSaatler.join(", ")}`);
        } else {
            alert(`✅ ${yeniSaatler.length} slot başarıyla eklendi.`);
        }
    };

    const doktorSlotSil = (slotId) => {
        setRandevuSlotlari((prev) => prev.filter((slot) => Number(slot.id) !== Number(slotId)));
    };

    return {
        // state
        randevuAdimi, setRandevuAdimi,
        hastaRandevuAkisi, setHastaRandevuAkisi,
        doktorTakvimFormu, setDoktorTakvimFormu,
        randevuListesi, setRandevuListesi,
        randevuSlotlari, setRandevuSlotlari,
        seciliIl, seciliPoliklinik,
        aramaSonuclari,
        // sorgular
        POLIKLINIKLER,
        doktoraAitMusaitSlotlar,
        doktoraAitIlkMusaitSlot,
        hastaneyeGoreUygunPoliklinikler,
        poliklinigeGoreUygunHastaneler,
        konumaGoreUygunHastaneler,
        hastaneVePoliklinigeGoreDoktorlar,
        doktoraVeHastaneyeGoreMusaitTarihler,
        doktoraVeHastaneyeGoreSaatler,
        // handler'lar
        resetHastaRandevuAkisi,
        geriGitRandevuAkisi,
        handleAramaTuruSec,
        handleHastaIlSec,
        handleHastaPoliklinikSec,
        handleHastaHastaneSec,
        handleHastaDoktorSec,
        handleHastaSlotSec,
        handleRandevuAl,
        doktorSlotEkle,
        doktorSlotSil,
    };
}