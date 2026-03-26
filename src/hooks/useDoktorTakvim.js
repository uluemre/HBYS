import { useState, useEffect, useMemo } from "react";
import { DOKTOR_LISTESI } from "../constants/doktorlar";
import { BASHEKIM_DEMO_NOBETLERI } from "../constants/hastaneler";
import { slotSirala, normalizeText } from "../utils/helpers";

const MIN_HAFTALIK = 40;
const MAX_HAFTALIK = 45;
const VARSAYILAN_HEDEF = 40;
const SLOT_SURESI = 1; // saat

// ─── Tarih yardımcıları ───────────────────────────────────────────────────────
const tarihYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const tarihObj = (str) => new Date(`${str}T00:00:00`);

export const haftaBaslangici = (tarih) => {
    const d = tarihObj(tarih);
    const gun = d.getDay();
    d.setDate(d.getDate() + (gun === 0 ? -6 : 1 - gun));
    return tarihYMD(d);
};

export const haftaBitisi = (tarih) => {
    const d = tarihObj(haftaBaslangici(tarih));
    d.setDate(d.getDate() + 6);
    return tarihYMD(d);
};

export const ayBaslangici = (tarih) => {
    const d = tarihObj(tarih);
    d.setDate(1);
    return tarihYMD(d);
};

export const ayBitisi = (tarih) => {
    const d = tarihObj(tarih);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return tarihYMD(d);
};

export const tarihAraliktaMi = (tarih, baslangic, bitis) =>
    tarih >= baslangic && tarih <= bitis;

export function useDoktorTakvim(randevuSlotlari, setRandevuSlotlari, muayeneKayitlari, randevuListesi) {
    const bugunString = new Date().toISOString().split("T")[0];

    const [doktorTakvimFormu, setDoktorTakvimFormu] = useState({
        hastaneId: "",
        tarih: "",
        seciliSaatler: [],
    });

    const [doktorHaftalikPlanlari, setDoktorHaftalikPlanlari] = useState(() => {
        const k = localStorage.getItem("doktor_haftalik_planlari");
        return k ? JSON.parse(k) : {};
    });

    const [nobetListesi, setNobetListesi] = useState(() => {
        const k = localStorage.getItem("bashekim_nobet_listesi");
        return k ? JSON.parse(k) : BASHEKIM_DEMO_NOBETLERI;
    });

    useEffect(() => {
        localStorage.setItem(
            "doktor_haftalik_planlari",
            JSON.stringify(doktorHaftalikPlanlari)
        );
    }, [doktorHaftalikPlanlari]);

    useEffect(() => {
        localStorage.setItem(
            "bashekim_nobet_listesi",
            JSON.stringify(nobetListesi)
        );
    }, [nobetListesi]);

    // ─── Yardımcı sorgular ────────────────────────────────────────────────────
    const doktorunHedefSaati = (doktorId) =>
        Number(doktorHaftalikPlanlari[doktorId]?.hedefSaat || VARSAYILAN_HEDEF);

    const doktorunHaftalikSlotlari = (doktorId, referansTarih) => {
        const bas = haftaBaslangici(referansTarih);
        const bit = haftaBitisi(referansTarih);
        return randevuSlotlari.filter(
            (s) =>
                Number(s.doktorId) === Number(doktorId) &&
                tarihAraliktaMi(s.tarih, bas, bit)
        );
    };

    const slotSaatToplami = (slotlar) => slotlar.length * SLOT_SURESI;

    const sonrakiNobetTarihi = () => {
        const d = tarihObj(bugunString);
        d.setDate(d.getDate() + 1);
        return tarihYMD(d);
    };

    // ─── Saat seçimi ──────────────────────────────────────────────────────────
    const saatSeciminiDegistir = (saat) => {
        setDoktorTakvimFormu((prev) => {
            const seciliMi = prev.seciliSaatler.includes(saat);
            return {
                ...prev,
                seciliSaatler: seciliMi
                    ? prev.seciliSaatler.filter((s) => s !== saat)
                    : [...prev.seciliSaatler, saat].sort(
                        (a, b) =>
                            new Date(`2000-01-01T${a}`) - new Date(`2000-01-01T${b}`)
                    ),
            };
        });
    };

    // ─── Slot ekleme ──────────────────────────────────────────────────────────
    const slotEkle = (aktifDoktorDemoKaydi) => {
        if (!aktifDoktorDemoKaydi)
            return alert("Doktor kaydınız demo listesi ile eşleşmedi.");
        if (
            !doktorTakvimFormu.hastaneId ||
            !doktorTakvimFormu.tarih ||
            doktorTakvimFormu.seciliSaatler.length === 0
        )
            return alert("Lütfen hastane, tarih ve en az bir saat seçiniz.");

        const hedefSaat = doktorunHedefSaati(aktifDoktorDemoKaydi.id);
        const haftalikSlotlar = doktorunHaftalikSlotlari(
            aktifDoktorDemoKaydi.id,
            doktorTakvimFormu.tarih
        );
        const mevcutHaftalikSaat = slotSaatToplami(haftalikSlotlar);

        const mevcutSaatler = randevuSlotlari
            .filter(
                (s) =>
                    Number(s.hastaneId) === Number(doktorTakvimFormu.hastaneId) &&
                    Number(s.doktorId) === Number(aktifDoktorDemoKaydi.id) &&
                    s.tarih === doktorTakvimFormu.tarih
            )
            .map((s) => s.saat);

        const yeniSaatler = doktorTakvimFormu.seciliSaatler.filter(
            (s) => !mevcutSaatler.includes(s)
        );

        if (yeniSaatler.length === 0)
            return alert("Seçtiğiniz saatlerin tamamı zaten eklenmiş.");

        const yeniToplamSaat = mevcutHaftalikSaat + yeniSaatler.length * SLOT_SURESI;
        if (yeniToplamSaat > MAX_HAFTALIK)
            return alert(
                `Bu ekleme haftalık sınırı aşar. Mevcut: ${mevcutHaftalikSaat} saat, üst sınır: ${MAX_HAFTALIK} saat.`
            );

        const yeniSlotlar = yeniSaatler.map((saat, i) => ({
            id: Date.now() + i,
            hastaneId: Number(doktorTakvimFormu.hastaneId),
            doktorId: Number(aktifDoktorDemoKaydi.id),
            poliklinik: aktifDoktorDemoKaydi.poliklinik,
            tarih: doktorTakvimFormu.tarih,
            saat,
            durum: "MUSAIT",
        }));

        setRandevuSlotlari((prev) => [...prev, ...yeniSlotlar].sort(slotSirala));

        const eklenemeyenler = doktorTakvimFormu.seciliSaatler.filter((s) =>
            mevcutSaatler.includes(s)
        );
        setDoktorTakvimFormu((prev) => ({ ...prev, seciliSaatler: [] }));

        const kalanSaat = Math.max(hedefSaat - yeniToplamSaat, 0);
        const hedefMsg =
            kalanSaat > 0
                ? `Haftalık hedef için kalan: ${kalanSaat} saat.`
                : `Haftalık hedef tamamlandı.`;

        alert(
            eklenemeyenler.length > 0
                ? `✅ ${yeniSaatler.length} slot eklendi.\n⚠️ Zaten kayıtlı: ${eklenemeyenler.join(", ")}\n📌 ${hedefMsg}`
                : `✅ ${yeniSaatler.length} slot başarıyla eklendi.\n📌 ${hedefMsg}`
        );
    };

    const slotSil = (slotId) => {
        setRandevuSlotlari((prev) =>
            prev.filter((s) => Number(s.id) !== Number(slotId))
        );
    };

    // ─── Haftalık hedef ───────────────────────────────────────────────────────
    const haftalikHedefGuncelle = (doktorId, hedefSaat) => {
        const saat = Number(hedefSaat);
        if (Number.isNaN(saat)) return alert("Geçerli bir saat giriniz.");
        if (saat < MIN_HAFTALIK || saat > MAX_HAFTALIK)
            return alert(
                `Haftalık hedef saat ${MIN_HAFTALIK}-${MAX_HAFTALIK} arasında olmalıdır.`
            );
        setDoktorHaftalikPlanlari((prev) => ({
            ...prev,
            [doktorId]: { ...(prev[doktorId] || {}), hedefSaat: saat },
        }));
        alert("Haftalık hedef saat kaydedildi.");
    };

    // ─── Nöbet ────────────────────────────────────────────────────────────────
    const nobetAta = (doktor) => {
        setNobetListesi((prev) => [
            {
                id: `NOB-${Date.now()}`,
                doktor: doktor.doktor || doktor.ad,
                poliklinik: doktor.poliklinik,
                tarih: sonrakiNobetTarihi(),
                saat: "20:00 - 08:00",
                durum: "Onaylı",
            },
            ...prev,
        ]);
        alert(`${doktor.doktor || doktor.ad} için nöbet eklendi.`);
    };

    const otomatikNobetOnerisi = () => {
        const eksikler = DOKTOR_LISTESI.map((d) => {
            const slotlar = doktorunHaftalikSlotlari(d.id, bugunString);
            const toplam = slotSaatToplami(slotlar);
            const hedef = doktorunHedefSaati(d.id);
            return {
                doktorId: d.id,
                doktor: d.ad,
                poliklinik: d.poliklinik,
                eksikSaat: Math.max(hedef - toplam, 0),
            };
        })
            .filter((x) => x.eksikSaat > 0)
            .sort((a, b) => b.eksikSaat - a.eksikSaat)
            .slice(0, 5);

        if (eksikler.length === 0) {
            alert("Bu hafta eksik saatli doktor bulunmuyor.");
            return;
        }

        const bas = tarihObj(sonrakiNobetTarihi());
        const oneriler = eksikler.map((d, i) => {
            const t = new Date(bas);
            t.setDate(bas.getDate() + i);
            return {
                id: `NOB-${Date.now()}-${i}`,
                doktor: d.doktor,
                poliklinik: d.poliklinik,
                tarih: tarihYMD(t),
                saat: "20:00 - 08:00",
                durum: "Onaylı",
            };
        });

        setNobetListesi((prev) => [...oneriler, ...prev]);
        alert("Eksik saatli doktorlara göre otomatik nöbet listesi oluşturuldu.");
    };

    // ─── Başhekim çalışma özeti ───────────────────────────────────────────────
    const bashekimCalismaOzeti = useMemo(() => {
        return DOKTOR_LISTESI.map((d) => {
            const slotlar = doktorunHaftalikSlotlari(d.id, bugunString);
            const toplam = slotSaatToplami(slotlar);
            const hedef = doktorunHedefSaati(d.id);
            const eksik = Math.max(hedef - toplam, 0);
            return {
                doktorId: d.id,
                doktor: d.ad,
                unvan: d.unvan,
                poliklinik: d.poliklinik,
                hedefSaat: hedef,
                toplamSaat: toplam,
                eksikSaat: eksik,
                durum:
                    toplam < hedef ? "Eksik" : toplam <= MAX_HAFTALIK ? "Yeterli" : "Fazla",
            };
        }).sort((a, b) => b.eksikSaat - a.eksikSaat);
    }, [randevuSlotlari, doktorHaftalikPlanlari]);

    // ─── Aktif doktor haftalık özeti ──────────────────────────────────────────
    const aktifDoktorHaftalikOzeti = (aktifDoktorDemoKaydi) => {
        if (!aktifDoktorDemoKaydi) return null;
        const ref = doktorTakvimFormu.tarih || bugunString;
        const slotlar = doktorunHaftalikSlotlari(aktifDoktorDemoKaydi.id, ref);
        const mevcutSaat = slotSaatToplami(slotlar);
        const hedefSaat = doktorunHedefSaati(aktifDoktorDemoKaydi.id);
        const seciliEkSaat = (doktorTakvimFormu.seciliSaatler?.length || 0) * SLOT_SURESI;
        const eklenecekSonrasi = mevcutSaat + seciliEkSaat;
        return {
            referansTarih: ref,
            haftaBaslangic: haftaBaslangici(ref),
            haftaBitis: haftaBitisi(ref),
            hedefSaat,
            mevcutSaat,
            seciliEkSaat,
            eklenecekSonrasiSaat: eklenecekSonrasi,
            kalanSaat: Math.max(hedefSaat - mevcutSaat, 0),
            eksikMi: mevcutSaat < hedefSaat,
            yeterliMi: mevcutSaat >= hedefSaat && mevcutSaat <= MAX_HAFTALIK,
            fazlaMi: mevcutSaat > MAX_HAFTALIK,
        };
    };

    return {
        doktorTakvimFormu,
        setDoktorTakvimFormu,
        doktorHaftalikPlanlari,
        setDoktorHaftalikPlanlari,
        nobetListesi,
        // sabitler
        MIN_HAFTALIK,
        MAX_HAFTALIK,
        VARSAYILAN_HEDEF,
        // fonksiyonlar
        saatSeciminiDegistir,
        slotEkle,
        slotSil,
        haftalikHedefGuncelle,
        nobetAta,
        otomatikNobetOnerisi,
        // hesaplamalar
        doktorunHedefSaati,
        doktorunHaftalikSlotlari,
        slotSaatToplami,
        bashekimCalismaOzeti,
        aktifDoktorHaftalikOzeti,
    };
}