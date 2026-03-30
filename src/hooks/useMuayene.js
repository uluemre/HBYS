import { useState, useEffect } from "react";
import { DOKTOR_LISTESI } from "../constants/doktorlar";
import { TETKIK_SABLONLARI } from "../constants/hastaneler";
import { formatTarih } from "../utils/helpers";

export function useMuayene(randevuListesi, setRandevuListesi) {
    const bugunString = new Date().toISOString().split("T")[0];

    const [muayeneKayitlari, setMuayeneKayitlari] = useState(() => {
        const k = localStorage.getItem("muayene_kayitlari");
        return k ? JSON.parse(k) : [];
    });

    const [tahlilIstekleri, setTahlilIstekleri] = useState(() => {
        const k = localStorage.getItem("tahlil_istekleri");
        return k ? JSON.parse(k) : [];
    });

    const [tahlilSonuclari, setTahlilSonuclari] = useState(() => {
        const k = localStorage.getItem("tahlil_sonuclari");
        return k ? JSON.parse(k) : [];
    });

    const [receteler, setReceteler] = useState(() => {
        const k = localStorage.getItem("receteler");
        return k ? JSON.parse(k) : [];
    });

    useEffect(() => {
        localStorage.setItem("muayene_kayitlari", JSON.stringify(muayeneKayitlari));
    }, [muayeneKayitlari]);

    useEffect(() => {
        localStorage.setItem("tahlil_istekleri", JSON.stringify(tahlilIstekleri));
    }, [tahlilIstekleri]);

    useEffect(() => {
        localStorage.setItem("tahlil_sonuclari", JSON.stringify(tahlilSonuclari));
    }, [tahlilSonuclari]);

    useEffect(() => {
        localStorage.setItem("receteler", JSON.stringify(receteler));
    }, [receteler]);

    // ─── Muayene akış fonksiyonları ──────────────────────────────────────────────
    const hastaGeldiIsaretle = (randevuId) => {
        setRandevuListesi((prev) =>
            prev.map((r) =>
                String(r.id) === String(randevuId) ? { ...r, durum: "HASTA_GELDI" } : r
            )
        );
    };

    const muayeneBaslat = (randevu) => {
        const mevcutMuayene = muayeneKayitlari.find(
            (m) => String(m.randevuId) === String(randevu.id)
        );

        if (mevcutMuayene) {
            setRandevuListesi((prev) =>
                prev.map((item) =>
                    String(item.id) === String(randevu.id)
                        ? { ...item, durum: "MUAYENEDE" }
                        : item
                )
            );
            return;
        }

        const yeniMuayene = {
            id: `MUA-${Date.now()}`,
            randevuId: randevu.id,
            hastaId: Number(randevu.hastaId || 1),
            doktorId: Number(randevu.doktorId),
            poliklinik: randevu.poliklinik,
            baslangicZamani: new Date().toISOString(),
            bitisZamani: null,
            sikayet: randevu.sikayet || "Muayene sırasında değerlendirilecek.",
            onTani: "Ön değerlendirme aşamasında",
            doktorNotu: "Muayene başlatıldı.",
            durum: "MUAYENEDE",
        };

        setMuayeneKayitlari((prev) => [yeniMuayene, ...prev]);
        setRandevuListesi((prev) =>
            prev.map((item) =>
                String(item.id) === String(randevu.id)
                    ? { ...item, durum: "MUAYENEDE" }
                    : item
            )
        );
    };

    const tahlilIste = (randevu, seciliTahliller = []) => {
        const muayene = muayeneKayitlari.find(
            (m) => String(m.randevuId) === String(randevu.id)
        );
        if (!muayene) return alert("Önce muayeneyi başlatmalısınız.");

        const mevcutTahliller = tahlilIstekleri.filter(
            (t) => String(t.muayeneId) === String(muayene.id)
        );
        if (mevcutTahliller.length > 0)
            return alert("Bu muayene için tahlil zaten istenmiş.");

        // Eğer dışarıdan seçili tahlil gelmediyse poliklinik şablonunu kullan (geriye dönük uyumluluk)
        const tetkikler =
            seciliTahliller.length > 0
                ? seciliTahliller
                : TETKIK_SABLONLARI[randevu.poliklinik] || ["Hemogram (Tam Kan Sayımı)"];

        const yeniTahliller = tetkikler.map((tetkik, index) => ({
            id: `TAH-${Date.now()}-${index}`,
            muayeneId: muayene.id,
            hastaId: muayene.hastaId,
            doktorId: muayene.doktorId,
            tahlilTuru: tetkik,
            istekTarihi: bugunString,
            durum: "ISTENDI",
        }));

        setTahlilIstekleri((prev) => [...yeniTahliller, ...prev]);
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayene.id)
                    ? {
                        ...item,
                        onTani:
                            item.onTani === "Ön değerlendirme aşamasında"
                                ? "Tetkik planlandı"
                                : item.onTani,
                        doktorNotu: `${item.doktorNotu} ${tetkikler.join(", ")} istendi.`,
                        durum: "TAHLIL_ISTENDI",
                    }
                    : item
            )
        );
        setRandevuListesi((prev) =>
            prev.map((item) =>
                String(item.id) === String(randevu.id)
                    ? { ...item, durum: "TAHLIL_BEKLENIYOR" }
                    : item
            )
        );
    };

    const numuneVerildiIsaretle = (muayeneId) => {
        setTahlilIstekleri((prev) =>
            prev.map((item) =>
                String(item.muayeneId) === String(muayeneId)
                    ? { ...item, durum: "LABORATUVARDA" }
                    : item
            )
        );
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayeneId)
                    ? { ...item, durum: "TAHLIL_BEKLENIYOR" }
                    : item
            )
        );
    };

    const ornekSonucUret = (tahlilTuru) => {
        const bank = {
            Hemogram: {
                sonucOzeti: "Hemoglobin değeri düşük bulundu.",
                referansDurumu: "REFERANS_DISI",
                sonucDetaylari: [
                    {
                        parametre: "Hemoglobin",
                        deger: "10.8",
                        birim: "g/dL",
                        referans: "12 - 16",
                        durum: "Düşük",
                    },
                ],
            },
            Biyokimya: {
                sonucOzeti: "Biyokimya değerleri genel olarak normal.",
                referansDurumu: "NORMAL",
                sonucDetaylari: [
                    {
                        parametre: "Glukoz",
                        deger: "92",
                        birim: "mg/dL",
                        referans: "70 - 100",
                        durum: "Normal",
                    },
                ],
            },
            CRP: {
                sonucOzeti: "CRP hafif yüksek bulundu.",
                referansDurumu: "REFERANS_DISI",
                sonucDetaylari: [
                    {
                        parametre: "CRP",
                        deger: "8.2",
                        birim: "mg/L",
                        referans: "0 - 5",
                        durum: "Yüksek",
                    },
                ],
            },
            "B12 Vitamini": {
                sonucOzeti: "B12 vitamini düşük bulundu.",
                referansDurumu: "REFERANS_DISI",
                sonucDetaylari: [
                    {
                        parametre: "B12",
                        deger: "180",
                        birim: "pg/mL",
                        referans: "200 - 900",
                        durum: "Düşük",
                    },
                ],
            },
        };

        return (
            bank[tahlilTuru] || {
                sonucOzeti: `${tahlilTuru} sonucu değerlendirildi.`,
                referansDurumu: "NORMAL",
                sonucDetaylari: [
                    {
                        parametre: tahlilTuru,
                        deger: "Normal",
                        birim: "-",
                        referans: "-",
                        durum: "Normal",
                    },
                ],
            }
        );
    };

    const tahlilSonucuHazirla = (muayeneId) => {
        const hedefTahliller = tahlilIstekleri.filter(
            (t) => String(t.muayeneId) === String(muayeneId)
        );
        if (hedefTahliller.length === 0)
            return alert("Bu muayene için tahlil bulunamadı.");

        const yeniSonuclar = hedefTahliller
            .filter((t) => !tahlilSonuclari.some((s) => String(s.tahlilId) === String(t.id)))
            .map((tahlil, index) => ({
                id: `SON-${Date.now()}-${index}`,
                tahlilId: tahlil.id,
                muayeneId,
                sonucTarihi: bugunString,
                ...ornekSonucUret(tahlil.tahlilTuru),
            }));

        if (yeniSonuclar.length === 0) return alert("Sonuçlar zaten oluşturulmuş.");

        setTahlilSonuclari((prev) => [...yeniSonuclar, ...prev]);
        setTahlilIstekleri((prev) =>
            prev.map((item) =>
                String(item.muayeneId) === String(muayeneId)
                    ? { ...item, durum: "SONUCLANDI" }
                    : item
            )
        );
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayeneId)
                    ? { ...item, durum: "SONUC_INCELENIYOR" }
                    : item
            )
        );
    };

    const sonucuIncele = (muayeneId) => {
        setTahlilIstekleri((prev) =>
            prev.map((item) =>
                String(item.muayeneId) === String(muayeneId)
                    ? { ...item, durum: "DOKTOR_INCELEDI" }
                    : item
            )
        );
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayeneId)
                    ? {
                        ...item,
                        doktorNotu: `${item.doktorNotu} Sonuçlar doktor tarafından değerlendirildi.`,
                        durum: "DOKTOR_INCELEDI",
                    }
                    : item
            )
        );
    };

    const receteYaz = (muayeneId, poliklinik) => {
        const mevcutRecete = receteler.find(
            (r) => String(r.muayeneId) === String(muayeneId)
        );
        if (mevcutRecete) return alert("Bu muayene için reçete zaten yazılmış.");

        const ilaclar =
            poliklinik === "Dahiliye (İç Hastalıkları)"
                ? [
                    { ilacAdi: "Demir İlacı", kullanim: "Günde 1 kez tok karnına", sure: "30 gün" },
                    { ilacAdi: "B12 Vitamini", kullanim: "Günde 1 kez", sure: "14 gün" },
                ]
                : poliklinik === "Kardiyoloji"
                    ? [{ ilacAdi: "Kalp Destek İlacı", kullanim: "Sabah 1 tablet", sure: "30 gün" }]
                    : [{ ilacAdi: "Genel Destek İlacı", kullanim: "Günde 1 kez", sure: "7 gün" }];

        const muayene = muayeneKayitlari.find(
            (m) => String(m.id) === String(muayeneId)
        );
        if (!muayene) return;

        setReceteler((prev) => [
            {
                id: `REC-${Date.now()}`,
                muayeneId,
                hastaId: muayene.hastaId,
                doktorId: muayene.doktorId,
                receteTarihi: bugunString,
                ilaclar,
                doktorNotu: "Tahlil sonucu sonrası reçete oluşturuldu.",
            },
            ...prev,
        ]);
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayeneId)
                    ? { ...item, durum: "RECETE_YAZILDI" }
                    : item
            )
        );
    };

    const muayeneTamamla = (randevuId, muayeneId) => {
        setMuayeneKayitlari((prev) =>
            prev.map((item) =>
                String(item.id) === String(muayeneId)
                    ? { ...item, bitisZamani: new Date().toISOString(), durum: "TAMAMLANDI" }
                    : item
            )
        );
        setRandevuListesi((prev) =>
            prev.map((item) =>
                String(item.id) === String(randevuId)
                    ? { ...item, durum: "TAMAMLANDI" }
                    : item
            )
        );
    };

    // ─── useMemo: doktora ait muayene süreçleri ──────────────────────────────────
    const buildDoktoraMuayeneSurecleri = (aktifDoktorDemoKaydi) => {
        if (!aktifDoktorDemoKaydi) return [];
        const doktorId = Number(aktifDoktorDemoKaydi.id);

        return randevuListesi
            .filter((r) => Number(r.doktorId) === doktorId)
            .map((randevu) => {
                const muayene = muayeneKayitlari.find(
                    (m) => String(m.randevuId) === String(randevu.id)
                );
                return {
                    ...randevu,
                    muayene,
                    tahliller: muayene
                        ? tahlilIstekleri.filter(
                            (t) => String(t.muayeneId) === String(muayene.id)
                        )
                        : [],
                    sonuclar: muayene
                        ? tahlilSonuclari.filter(
                            (s) => String(s.muayeneId) === String(muayene.id)
                        )
                        : [],
                    recete: muayene
                        ? receteler.find((rec) => String(rec.muayeneId) === String(muayene.id))
                        : null,
                };
            })
            .sort(
                (a, b) =>
                    new Date(`${b.tarih}T${b.saat}`) - new Date(`${a.tarih}T${a.saat}`)
            );
    };

    // ─── useMemo: hastaya ait tahlil görünümü ────────────────────────────────────
    const buildHastaTahlilGorunumu = (girisYapanKullanici) => {
        if (!girisYapanKullanici || girisYapanKullanici.rol !== "HASTA") return [];

        const hastaId = Number(girisYapanKullanici.id);
        const satirlar = [];

        muayeneKayitlari
            .filter((m) => Number(m.hastaId) === hastaId)
            .forEach((muayene) => {
                const randevu = randevuListesi.find(
                    (r) => String(r.id) === String(muayene.randevuId)
                );
                const doktorKaydi = DOKTOR_LISTESI.find(
                    (d) => Number(d.id) === Number(muayene.doktorId)
                );

                tahlilIstekleri
                    .filter((t) => String(t.muayeneId) === String(muayene.id))
                    .forEach((tahlil) => {
                        const sonuc = tahlilSonuclari.find(
                            (s) => String(s.tahlilId) === String(tahlil.id)
                        );
                        const recete = receteler.find(
                            (r) => String(r.muayeneId) === String(muayene.id)
                        );
                        satirlar.push({
                            muayeneTarihi: randevu ? formatTarih(randevu.tarih) : "—",
                            poliklinik: randevu?.poliklinik || muayene.poliklinik || "—",
                            doktor: doktorKaydi?.ad || randevu?.doktor || "—",
                            tahlilTuru: tahlil.tahlilTuru,
                            sonucOzeti: sonuc?.sonucOzeti || "Sonuç bekleniyor",
                            sonucTarihi: sonuc?.sonucTarihi
                                ? formatTarih(sonuc.sonucTarihi)
                                : "—",
                            receteDurumu: recete ? "Reçete yazıldı" : "Henüz yazılmadı",
                            durum: tahlil.durum,
                        });
                    });
            });

        return satirlar
            .sort((a, b) => a.muayeneTarihi.localeCompare(b.muayeneTarihi))
            .reverse();
    };
    const buildHastaReceteGorunumu = (girisYapanKullanici) => {
        if (!girisYapanKullanici || girisYapanKullanici.rol !== "HASTA") return [];
        const hastaId = Number(girisYapanKullanici.id);

        return receteler
            .filter((r) => Number(r.hastaId) === hastaId)
            .map((recete) => {
                const muayene = muayeneKayitlari.find(
                    (m) => String(m.id) === String(recete.muayeneId)
                );
                const randevu = randevuListesi.find(
                    (r) => String(r.id) === String(muayene?.randevuId)
                );
                const doktorKaydi = DOKTOR_LISTESI.find(
                    (d) => Number(d.id) === Number(recete.doktorId)
                );
                return {
                    id: recete.id,
                    tarih: recete.receteTarihi ? formatTarih(recete.receteTarihi) : "—",
                    poliklinik: randevu?.poliklinik || muayene?.poliklinik || "—",
                    doktor: doktorKaydi?.ad || randevu?.doktor || "—",
                    doktorNotu: recete.doktorNotu || "",
                    ilaclar: recete.ilaclar || [],
                };
            })
            .sort((a, b) => b.tarih.localeCompare(a.tarih));
    };
    const buildHastaGecmisi = (hastaId, doktorId) => {
        if (!hastaId || !doktorId) return [];

        return randevuListesi
            .filter(
                (r) =>
                    Number(r.hastaId) === Number(hastaId) &&
                    Number(r.doktorId) === Number(doktorId) &&
                    r.durum === "TAMAMLANDI"
            )
            .map((randevu) => {
                const muayene = muayeneKayitlari.find(
                    (m) => String(m.randevuId) === String(randevu.id)
                );
                return {
                    randevuId: randevu.id,
                    tarih: randevu.tarih,
                    saat: randevu.saat,
                    poliklinik: randevu.poliklinik,
                    sikayet: randevu.sikayet,
                    onTani: muayene?.onTani || "—",
                    doktorNotu: muayene?.doktorNotu || "—",
                    tahliller: muayene
                        ? tahlilIstekleri.filter(
                            (t) => String(t.muayeneId) === String(muayene.id)
                        )
                        : [],
                    sonuclar: muayene
                        ? tahlilSonuclari.filter(
                            (s) => String(s.muayeneId) === String(muayene.id)
                        )
                        : [],
                    recete: muayene
                        ? receteler.find(
                            (r) => String(r.muayeneId) === String(muayene.id)
                        )
                        : null,
                };
            })
            .sort(
                (a, b) =>
                    new Date(`${b.tarih}T${b.saat}`) -
                    new Date(`${a.tarih}T${a.saat}`)
            );
    };
    return {
        muayeneKayitlari,
        tahlilIstekleri,
        tahlilSonuclari,
        receteler,
        // fonksiyonlar
        hastaGeldiIsaretle,
        muayeneBaslat,
        tahlilIste,
        numuneVerildiIsaretle,
        tahlilSonucuHazirla,
        sonucuIncele,
        receteYaz,
        muayeneTamamla,
        // builder'lar (useMemo dışarıda yapılır)
        buildDoktoraMuayeneSurecleri,
        buildHastaTahlilGorunumu,
        buildHastaReceteGorunumu,
        buildHastaGecmisi,
    };
}