// ─── Tahlil referans aralıkları ───────────────────────────────────────────────
// Her tahlil için: birim, min, max, kritikMin, kritikMax, risk seviyeleri

export const TAHLIL_REFERANSLARI = {
    // ── Kan Tahlilleri ──────────────────────────────────────────────────────
    "Hemogram (Tam Kan Sayımı)": [
        { parametre: "Hemoglobin", birim: "g/dL", min: 12.0, max: 17.5, kritikMin: 7.0, kritikMax: 20.0 },
        { parametre: "Hematokrit", birim: "%", min: 36.0, max: 52.0, kritikMin: 20.0, kritikMax: 60.0 },
        { parametre: "Eritrosit", birim: "M/µL", min: 4.0, max: 5.9, kritikMin: 2.0, kritikMax: 7.0 },
        { parametre: "Lökosit", birim: "K/µL", min: 4.5, max: 11.0, kritikMin: 2.0, kritikMax: 30.0 },
        { parametre: "Trombosit", birim: "K/µL", min: 150.0, max: 400.0, kritikMin: 50.0, kritikMax: 1000.0 },
        { parametre: "MCV", birim: "fL", min: 80.0, max: 100.0, kritikMin: 60.0, kritikMax: 120.0 },
        { parametre: "MCH", birim: "pg", min: 27.0, max: 33.0, kritikMin: 20.0, kritikMax: 40.0 },
        { parametre: "Nötrofil %", birim: "%", min: 50.0, max: 70.0, kritikMin: 20.0, kritikMax: 95.0 },
        { parametre: "Lenfosit %", birim: "%", min: 20.0, max: 40.0, kritikMin: 5.0, kritikMax: 60.0 },
        { parametre: "Eozinofil %", birim: "%", min: 1.0, max: 4.0, kritikMin: 0.0, kritikMax: 20.0 },
    ],
    "Biyokimya Paneli": [
        { parametre: "Glukoz", birim: "mg/dL", min: 70.0, max: 100.0, kritikMin: 40.0, kritikMax: 500.0 },
        { parametre: "Üre", birim: "mg/dL", min: 15.0, max: 45.0, kritikMin: 5.0, kritikMax: 200.0 },
        { parametre: "Kreatinin", birim: "mg/dL", min: 0.6, max: 1.2, kritikMin: 0.3, kritikMax: 10.0 },
        { parametre: "ALT", birim: "U/L", min: 7.0, max: 40.0, kritikMin: 0.0, kritikMax: 500.0 },
        { parametre: "AST", birim: "U/L", min: 10.0, max: 40.0, kritikMin: 0.0, kritikMax: 500.0 },
        { parametre: "Total Bilirubin", birim: "mg/dL", min: 0.2, max: 1.2, kritikMin: 0.0, kritikMax: 20.0 },
        { parametre: "Sodyum", birim: "mEq/L", min: 136.0, max: 145.0, kritikMin: 120.0, kritikMax: 160.0 },
        { parametre: "Potasyum", birim: "mEq/L", min: 3.5, max: 5.1, kritikMin: 2.5, kritikMax: 6.5 },
        { parametre: "Kalsiyum", birim: "mg/dL", min: 8.5, max: 10.5, kritikMin: 6.0, kritikMax: 14.0 },
        { parametre: "Albumin", birim: "g/dL", min: 3.5, max: 5.0, kritikMin: 1.5, kritikMax: 6.0 },
    ],
    "CRP (C-Reaktif Protein)": [
        { parametre: "CRP", birim: "mg/L", min: 0.0, max: 5.0, kritikMin: 0.0, kritikMax: 200.0 },
        { parametre: "Fibrinojen", birim: "mg/dL", min: 200.0, max: 400.0, kritikMin: 100.0, kritikMax: 800.0 },
    ],
    "Sedimantasyon (ESR)": [
        { parametre: "Sedimantasyon", birim: "mm/h", min: 0.0, max: 20.0, kritikMin: 0.0, kritikMax: 120.0 },
    ],
    "Troponin": [
        { parametre: "Troponin I", birim: "ng/mL", min: 0.0, max: 0.04, kritikMin: 0.0, kritikMax: 10.0 },
        { parametre: "Troponin T", birim: "ng/mL", min: 0.0, max: 0.01, kritikMin: 0.0, kritikMax: 5.0 },
    ],
    "D-Dimer": [
        { parametre: "D-Dimer", birim: "µg/mL", min: 0.0, max: 0.5, kritikMin: 0.0, kritikMax: 10.0 },
    ],
    "Ferritin": [
        { parametre: "Ferritin", birim: "ng/mL", min: 12.0, max: 300.0, kritikMin: 5.0, kritikMax: 1000.0 },
    ],
    "Serum Demir": [
        { parametre: "Serum Demir", birim: "µg/dL", min: 60.0, max: 170.0, kritikMin: 20.0, kritikMax: 400.0 },
        { parametre: "TIBC", birim: "µg/dL", min: 250.0, max: 370.0, kritikMin: 100.0, kritikMax: 600.0 },
        { parametre: "Transferrin Sat.", birim: "%", min: 20.0, max: 50.0, kritikMin: 5.0, kritikMax: 90.0 },
    ],

    // ── Hormon Tahlilleri ────────────────────────────────────────────────────
    "TSH (Tiroid Stimülan Hormon)": [
        { parametre: "TSH", birim: "mIU/L", min: 0.4, max: 4.0, kritikMin: 0.01, kritikMax: 100.0 },
    ],
    "T3 / T4 (Serbest)": [
        { parametre: "Serbest T3", birim: "pg/mL", min: 2.3, max: 4.2, kritikMin: 1.0, kritikMax: 10.0 },
        { parametre: "Serbest T4", birim: "ng/dL", min: 0.89, max: 1.76, kritikMin: 0.4, kritikMax: 5.0 },
    ],
    "FSH / LH": [
        { parametre: "FSH", birim: "mIU/mL", min: 1.5, max: 12.4, kritikMin: 0.0, kritikMax: 100.0 },
        { parametre: "LH", birim: "mIU/mL", min: 1.7, max: 8.6, kritikMin: 0.0, kritikMax: 100.0 },
    ],
    "Prolaktin": [
        { parametre: "Prolaktin", birim: "ng/mL", min: 2.0, max: 29.0, kritikMin: 0.0, kritikMax: 200.0 },
    ],
    "Kortizol": [
        { parametre: "Kortizol (Sabah)", birim: "µg/dL", min: 6.2, max: 19.4, kritikMin: 2.0, kritikMax: 50.0 },
    ],
    "İnsülin": [
        { parametre: "İnsülin (Açlık)", birim: "µIU/mL", min: 2.0, max: 25.0, kritikMin: 0.0, kritikMax: 100.0 },
        { parametre: "HOMA-IR", birim: "-", min: 0.0, max: 2.5, kritikMin: 0.0, kritikMax: 10.0 },
    ],
    "Beta HCG (Gebelik)": [
        { parametre: "Beta HCG", birim: "mIU/mL", min: 0.0, max: 5.0, kritikMin: 0.0, kritikMax: 200000.0 },
    ],
    "Testosteron": [
        { parametre: "Total Testosteron", birim: "ng/dL", min: 270.0, max: 1070.0, kritikMin: 50.0, kritikMax: 2000.0 },
    ],

    // ── Vitamin & Mineral ────────────────────────────────────────────────────
    "B12 Vitamini": [
        { parametre: "Vitamin B12", birim: "pg/mL", min: 200.0, max: 900.0, kritikMin: 100.0, kritikMax: 2000.0 },
    ],
    "D Vitamini (25-OH)": [
        { parametre: "25-OH Vitamin D", birim: "ng/mL", min: 30.0, max: 100.0, kritikMin: 10.0, kritikMax: 150.0 },
    ],
    "Folik Asit": [
        { parametre: "Folik Asit", birim: "ng/mL", min: 3.0, max: 17.0, kritikMin: 1.0, kritikMax: 30.0 },
    ],
    "Magnezyum": [
        { parametre: "Magnezyum", birim: "mg/dL", min: 1.7, max: 2.3, kritikMin: 1.0, kritikMax: 4.0 },
    ],
    "Kalsiyum": [
        { parametre: "Kalsiyum", birim: "mg/dL", min: 8.5, max: 10.5, kritikMin: 6.0, kritikMax: 14.0 },
    ],

    // ── İdrar Tahlilleri ─────────────────────────────────────────────────────
    "Tam İdrar Tahlili": [
        { parametre: "pH", birim: "", min: 5.0, max: 8.0, kritikMin: 4.0, kritikMax: 9.0 },
        { parametre: "Dansitite", birim: "", min: 1010, max: 1025, kritikMin: 1001, kritikMax: 1035 },
        { parametre: "Protein", birim: "mg/dL", min: 0.0, max: 14.0, kritikMin: 0.0, kritikMax: 300.0 },
        { parametre: "Glukoz (İdrar)", birim: "mg/dL", min: 0.0, max: 15.0, kritikMin: 0.0, kritikMax: 1000.0 },
        { parametre: "Lökosit (İdrar)", birim: "/HPF", min: 0.0, max: 5.0, kritikMin: 0.0, kritikMax: 100.0 },
        { parametre: "Eritrosit (İdrar)", birim: "/HPF", min: 0.0, max: 3.0, kritikMin: 0.0, kritikMax: 100.0 },
    ],

    // ── Biyokimya / Organ Fonksiyon ──────────────────────────────────────────
    "ALT (Karaciğer Enzimi)": [
        { parametre: "ALT", birim: "U/L", min: 7.0, max: 40.0, kritikMin: 0.0, kritikMax: 500.0 },
    ],
    "AST (Karaciğer Enzimi)": [
        { parametre: "AST", birim: "U/L", min: 10.0, max: 40.0, kritikMin: 0.0, kritikMax: 500.0 },
    ],
    "GGT": [
        { parametre: "GGT", birim: "U/L", min: 8.0, max: 61.0, kritikMin: 0.0, kritikMax: 500.0 },
    ],
    "Kreatinin": [
        { parametre: "Kreatinin", birim: "mg/dL", min: 0.6, max: 1.2, kritikMin: 0.3, kritikMax: 10.0 },
    ],
    "Üre / BUN": [
        { parametre: "Üre", birim: "mg/dL", min: 15.0, max: 45.0, kritikMin: 5.0, kritikMax: 200.0 },
        { parametre: "BUN", birim: "mg/dL", min: 7.0, max: 20.0, kritikMin: 3.0, kritikMax: 100.0 },
    ],
    "Glukoz (Açlık)": [
        { parametre: "Açlık Glukozu", birim: "mg/dL", min: 70.0, max: 100.0, kritikMin: 40.0, kritikMax: 500.0 },
    ],
    "HbA1c (Şeker Ort.)": [
        { parametre: "HbA1c", birim: "%", min: 4.0, max: 5.7, kritikMin: 3.0, kritikMax: 15.0 },
    ],
    "Total Kolesterol": [
        { parametre: "Total Kolesterol", birim: "mg/dL", min: 0.0, max: 200.0, kritikMin: 0.0, kritikMax: 500.0 },
        { parametre: "LDL", birim: "mg/dL", min: 0.0, max: 100.0, kritikMin: 0.0, kritikMax: 300.0 },
        { parametre: "HDL", birim: "mg/dL", min: 40.0, max: 60.0, kritikMin: 20.0, kritikMax: 100.0 },
        { parametre: "Trigliserit", birim: "mg/dL", min: 0.0, max: 150.0, kritikMin: 0.0, kritikMax: 1000.0 },
    ],

    // ── Enfeksiyon & İmmün ───────────────────────────────────────────────────
    "HBsAg (Hepatit B)": [
        { parametre: "HBsAg", birim: "", min: 0.0, max: 1.0, kritikMin: 0.0, kritikMax: 1.0, pozitifEsik: 1.0 },
    ],
    "Anti-HCV (Hepatit C)": [
        { parametre: "Anti-HCV", birim: "", min: 0.0, max: 1.0, kritikMin: 0.0, kritikMax: 1.0, pozitifEsik: 1.0 },
    ],
    "IgE (Alerji)": [
        { parametre: "Total IgE", birim: "IU/mL", min: 0.0, max: 100.0, kritikMin: 0.0, kritikMax: 5000.0 },
    ],
    "RF (Romatoid Faktör)": [
        { parametre: "RF", birim: "IU/mL", min: 0.0, max: 14.0, kritikMin: 0.0, kritikMax: 500.0 },
    ],
    "ASO (Streptokok)": [
        { parametre: "ASO", birim: "IU/mL", min: 0.0, max: 200.0, kritikMin: 0.0, kritikMax: 800.0 },
    ],

    // ── Onkoloji Belirteçleri ────────────────────────────────────────────────
    "PSA (Prostat)": [
        { parametre: "PSA", birim: "ng/mL", min: 0.0, max: 4.0, kritikMin: 0.0, kritikMax: 100.0 },
    ],
    "CA 125 (Yumurtalık)": [
        { parametre: "CA 125", birim: "U/mL", min: 0.0, max: 35.0, kritikMin: 0.0, kritikMax: 1000.0 },
    ],
    "CA 19-9 (Pankreas)": [
        { parametre: "CA 19-9", birim: "U/mL", min: 0.0, max: 37.0, kritikMin: 0.0, kritikMax: 1000.0 },
    ],
    "CEA (Kolorektal)": [
        { parametre: "CEA", birim: "ng/mL", min: 0.0, max: 3.0, kritikMin: 0.0, kritikMax: 200.0 },
    ],
};

// ─── Sonuç üreteci ────────────────────────────────────────────────────────────
// Max 3 anormal, genel sonuç sağlıklı yönelimli
export const tahlilSonucuUret = (tahlilTuru) => {
    const parametreler = TAHLIL_REFERANSLARI[tahlilTuru];
    if (!parametreler || parametreler.length === 0) {
        return {
            sonucDetaylari: [{ parametre: tahlilTuru, deger: "Bekleniyor", birim: "-", referans: "-", durum: "Normal", risk: "Düşük" }],
            genelDurum: "Normal",
            anormalSayisi: 0,
        };
    }

    // Kaç parametre anormal olacak? Max 3, ve toplam sayının %30'undan fazla olmasın
    const maxAnormal = Math.min(3, Math.floor(parametreler.length * 0.3));
    const anormalSayisi = Math.floor(Math.random() * (maxAnormal + 1)); // 0..maxAnormal

    // Hangi indeksler anormal olacak?
    const anormalIndeksler = new Set();
    while (anormalIndeksler.size < anormalSayisi) {
        anormalIndeksler.add(Math.floor(Math.random() * parametreler.length));
    }

    const sonucDetaylari = parametreler.map((p, idx) => {
        const anormal = anormalIndeksler.has(idx);
        let deger;

        if (!anormal) {
            // Normal aralıkta rastgele değer
            deger = rastgeleDeger(p.min, p.max);
        } else {
            // Anormal — düşük mu yüksek mi? %50/%50
            const dusukMu = Math.random() < 0.5;
            if (dusukMu) {
                deger = rastgeleDeger(p.kritikMin, p.min * 0.95);
            } else {
                deger = rastgeleDeger(p.max * 1.05, p.kritikMax);
            }
        }

        const durum = degerDurumu(deger, p.min, p.max);
        const risk = riskSeviyesi(deger, p.min, p.max, p.kritikMin, p.kritikMax);

        return {
            parametre: p.parametre,
            deger: formatDeger(deger, p.birim),
            birim: p.birim,
            referans: `${p.min} - ${p.max}`,
            durum,
            risk,
            anormal,
        };
    });

    const anormalSonucSayisi = sonucDetaylari.filter(s => s.anormal).length;
    const yuksekRisk = sonucDetaylari.some(s => s.risk === "Yüksek");
    const ortaRisk = sonucDetaylari.some(s => s.risk === "Orta");

    let genelDurum = "Normal";
    if (yuksekRisk) genelDurum = "Dikkat Gerektirir";
    else if (ortaRisk || anormalSonucSayisi > 0) genelDurum = "Hafif Anormal";

    return { sonucDetaylari, genelDurum, anormalSayisi: anormalSonucSayisi };
};

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────
const rastgeleDeger = (min, max) => {
    if (min >= max) return min;
    return Math.random() * (max - min) + min;
};

const formatDeger = (deger, birim) => {
    if (birim === "" || birim === "-") return Math.round(deger).toString();
    if (deger >= 100) return deger.toFixed(1);
    if (deger >= 10) return deger.toFixed(2);
    return deger.toFixed(3);
};

const degerDurumu = (deger, min, max) => {
    if (deger < min) return "Düşük";
    if (deger > max) return "Yüksek";
    return "Normal";
};

const riskSeviyesi = (deger, min, max, kritikMin, kritikMax) => {
    if (deger >= min && deger <= max) return "Düşük"; // Normal

    const aralik = max - min;
    const sapma = deger < min ? min - deger : deger - max;
    const sapmaPüzde = sapma / aralik;

    // Kritik sınıra yakınsa Yüksek
    const kritikAralik = Math.max(max - min, 1);
    const kritikSapma = deger < min
        ? (min - deger) / (min - kritikMin || 1)
        : (deger - max) / (kritikMax - max || 1);

    if (kritikSapma > 0.6) return "Yüksek";
    if (kritikSapma > 0.2 || sapmaPüzde > 0.3) return "Orta";
    return "Düşük";
};